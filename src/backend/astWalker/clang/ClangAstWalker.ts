import * as clangAst from "./clang_ast_json";
import {
    hasCompoundStmtInInner,
    isElementVirtualFuncDeclaration,
} from "./clang_ast_json_helper";
import * as db from "../../database/Database";
import * as cpp from "../../database/cpp_structure";
import { AstWalker } from "../AstWalker";

// These types are used to cache the types with the ID. Since the ID is changing
// all the time, it should not be stored in the actual type.
type SimpleFuncDeclaration = {
    id: number;
    mentioningData: cpp.FuncDeclaration | cpp.FuncImplementation;
};
type SimpleVirtualFuncDeclaration = {
    id: number;
    mentioningData: cpp.VirtualFuncDeclaration | cpp.VirtualFuncImplementation;
};

export class ClangAstWalker implements AstWalker {
    private fileName: string = "";
    private database: db.Database;
    private baseAstElement: clangAst.AstElement;

    // At the beginning it will be a derived HppFile.
    private currentlyAnalyzedFile: db.CppFile | undefined = undefined;

    // Sadly we need to cache a few data, which are reported once
    // and no longer until a new value is seen.
    private lastSeenLocLineNumber: number = -1;
    private lastSeenRangeBeginLine: number = -1;
    private lastSeenRangeEndLine: number = -1;
    private lastCallExprBeginLocation: db.Location = { line: -1, column: -1 };
    private lastCallExprEndLocation: db.Location = { line: -1, column: -1 };

    private callingFunc: cpp.FuncImplementation | undefined;
    private knownClasses: cpp.CppClass[] = [];
    private activeClassStack: cpp.CppClass[] = [];

    private funcDeclarations: SimpleFuncDeclaration[] = [];
    private virtualFuncDeclarations: SimpleVirtualFuncDeclaration[] = [];

    constructor(
        fileName: string,
        database: db.Database,
        baseAstElement: clangAst.AstElement
    ) {
        this.fileName = fileName;
        this.database = database;
        this.baseAstElement = baseAstElement;
    }

    async walkAst(): Promise<void> {
        await this.analyzeAstElement(this.baseAstElement);

        this.currentlyAnalyzedFile?.justAnalyzed();
        this.database.writeDatabase();
    }

    getFileName(): string {
        return this.fileName;
    }

    private async analyzeAstElement(
        astElement: clangAst.AstElement
    ): Promise<void> {
        // The file name and the source line are only mentioned in the first
        // seen element of the file.
        // Therefore we need to cache the value.
        this.handleLocAndRange(astElement);

        if (astElement.kind === "CXXRecordDecl") {
            await this.handleClassDecl(astElement);
        } else if (
            astElement.kind === "FunctionDecl" ||
            astElement.kind === "CXXMethodDecl"
        ) {
            await this.handleFunctionDecl(astElement);
        } else {
            if (
                astElement.kind === "CallExpr" ||
                astElement.kind === "CXXMemberCallExpr"
            ) {
                this.updateLastCallExprLocation(astElement);
            } else if (
                astElement.kind === "DeclRefExpr" ||
                astElement.kind === "MemberExpr"
            ) {
                this.handleExprStmt(astElement);
            }

            if (astElement.inner) {
                for (const newAstElement of astElement.inner) {
                    await this.analyzeAstElement(newAstElement);
                }
            }
        }
    }

    private handleLocAndRange(astElement: clangAst.AstElement) {
        if (astElement.loc && astElement.loc.file) {
            this.currentlyAnalyzedFile?.justAnalyzed();

            if (astElement.loc.file === this.fileName) {
                this.currentlyAnalyzedFile = this.database.getOrAddCppFile(
                    this.fileName
                );
            } else {
                this.currentlyAnalyzedFile = this.database.getOrAddHppFile(
                    astElement.loc.file
                );

                (
                    this.currentlyAnalyzedFile as db.HppFile
                ).addReferencedFromCppFile(this.fileName);
            }
        }
        if (astElement.loc && astElement.loc.line) {
            this.lastSeenLocLineNumber = astElement.loc.line;
        }
        if (astElement.range && astElement.range.begin.line) {
            this.lastSeenRangeBeginLine = astElement.range.begin.line;
            // The end also may hit a new line. But in case it doesn't,
            // we record it here.
            this.lastSeenRangeEndLine = this.lastSeenRangeBeginLine;
        }
        if (astElement.range && astElement.range.end.line) {
            this.lastSeenRangeEndLine = astElement.range.end.line;
        }
    }

    private updateLastCallExprLocation(astElement: clangAst.AstElement) {
        this.lastCallExprBeginLocation = this.getRangeStartLocation(astElement);
        this.lastCallExprEndLocation = this.getRangeEndLocation(astElement);
    }

    private getRangeStartLocation(
        astElement: clangAst.AstElement
    ): db.Location {
        return {
            line:
                astElement.range &&
                astElement.range.begin &&
                astElement.range.begin.line
                    ? astElement.range.begin.line
                    : this.lastSeenRangeBeginLine,
            column:
                astElement.range &&
                astElement.range.begin &&
                astElement.range.begin.col
                    ? astElement.range.begin.col
                    : -1,
        };
    }

    private getRangeEndLocation(astElement: clangAst.AstElement): db.Location {
        return {
            line:
                astElement.range &&
                astElement.range.end &&
                astElement.range.end.line
                    ? astElement.range.end.line
                    : astElement.range &&
                      astElement.range.begin &&
                      astElement.range.begin.line
                    ? astElement.range.begin.line
                    : this.lastSeenRangeBeginLine,
            column:
                astElement.range &&
                astElement.range.end &&
                astElement.range.end.col
                    ? astElement.range.end.col +
                      (astElement.range.end.tokLen
                          ? astElement.range.end.tokLen
                          : 0)
                    : -1,
        };
    }

    private getRange(astElement: clangAst.AstElement): db.Range {
        return {
            start: this.getRangeStartLocation(astElement),
            end: this.getRangeEndLocation(astElement),
        };
    }

    private getLocBasedRangeStartLocation(
        astElement: clangAst.AstElement
    ): db.Location {
        return {
            line: this.lastSeenLocLineNumber,
            column: astElement.loc
                ? astElement.loc.col
                    ? astElement.loc.col
                    : -1
                : -1,
        };
    }

    private getLocBasedRangeEndLocation(
        astElement: clangAst.AstElement,
        startLocation: db.Location
    ): db.Location {
        return {
            line: this.lastSeenLocLineNumber,
            column:
                startLocation.column +
                (astElement.loc
                    ? astElement.loc.tokLen
                        ? astElement.loc.tokLen
                        : 0
                    : 0),
        };
    }

    private getLocBasedRange(astElement: clangAst.AstElement): db.Range {
        const startLocation = this.getLocBasedRangeStartLocation(astElement);
        return {
            start: startLocation,
            end: this.getLocBasedRangeEndLocation(astElement, startLocation),
        };
    }

    private async handleClassDecl(
        astElement: clangAst.AstElement
    ): Promise<void> {
        const newClass =
            this.activeClassStack.length === 0
                ? await this.currentlyAnalyzedFile!.getOrAddClass(
                      astElement.name!
                  )
                : await this.activeClassStack[
                      this.activeClassStack.length - 1
                  ].getOrAddClass(astElement.name!);

        if (astElement.bases) {
            astElement.bases.forEach((base) => {
                const foundClass = this.knownClasses.find(
                    (knownClass) => knownClass.getName() === base.type.qualType
                );
                if (foundClass) {
                    newClass.addParentClass(foundClass);
                }
            });
        }

        this.knownClasses.push(newClass);
        this.activeClassStack.push(newClass);

        if (astElement.inner) {
            for (const newAstElement of astElement.inner) {
                // There are class mirrors in the class directly on the first level.
                // This phantom element should be filtered out.
                if (
                    !(
                        newAstElement.kind === "CXXRecordDecl" &&
                        newAstElement.name === newClass.getName()
                    )
                ) {
                    await this.analyzeAstElement(newAstElement);
                }
            }
        }

        this.activeClassStack.pop();
    }

    private async handleFunctionDecl(
        astElement: clangAst.AstElement
    ): Promise<void> {
        // Function declaration in function declaration is no C++ thing.
        // But still we do this since maybe we one day walk some nice
        // language like python or C++ gets extended.
        const currentCallingFuncName = this.callingFunc;

        if (isElementVirtualFuncDeclaration(astElement)) {
            await this.handleVirtualFuncDecl(astElement);
        } else {
            await this.handleFuncDecl(astElement);
        }

        if (astElement.inner) {
            for (const newAstElement of astElement.inner) {
                await this.analyzeAstElement(newAstElement);
            }
        }

        this.callingFunc = currentCallingFuncName;
    }

    private handleExprStmt(astElement: clangAst.AstElement) {
        const calledFuncId: string | undefined = astElement.referencedDecl
            ? astElement.kind === "DeclRefExpr"
                ? astElement.referencedDecl.id
                : astElement.referencedMemberDecl
            : astElement.referencedMemberDecl
            ? astElement.referencedMemberDecl
            : undefined;
        if (calledFuncId) {
            const referencedDecl = this.funcDeclarations.find(
                (funcDec) => funcDec.id === Number(calledFuncId)
            );
            if (referencedDecl) {
                const funcCall = this.createFuncCallArgs(referencedDecl);
                this.callingFunc?.addFuncCall(funcCall);
            } else {
                const referencedVirtualDecl = this.virtualFuncDeclarations.find(
                    (funcDec) => funcDec.id === Number(calledFuncId)
                );
                if (referencedVirtualDecl) {
                    const funcCall = this.createVirtualFuncCallArgs(
                        referencedVirtualDecl
                    );
                    this.callingFunc?.addVirtualFuncCall(funcCall);
                }
            }
        }
    }

    private async handleVirtualFuncDecl(
        astElement: clangAst.AstElement
    ): Promise<void> {
        const currentClass =
            this.activeClassStack[this.activeClassStack.length - 1];

        const creationArgs = await this.createVirtualFuncMentioningArgs(
            astElement,
            currentClass
        );

        const id = Number(astElement.id);
        const virtualFuncMentioning = hasCompoundStmtInInner(astElement)
            ? await currentClass.getOrAddVirtualFuncImpl(creationArgs)
            : await currentClass.getOrAddVirtualFuncDecl(creationArgs);

        this.virtualFuncDeclarations.push({
            id,
            mentioningData: virtualFuncMentioning,
        });

        if (hasCompoundStmtInInner(astElement)) {
            this.callingFunc =
                virtualFuncMentioning as cpp.VirtualFuncImplementation;
        }
    }

    private async handleFuncDecl(
        astElement: clangAst.AstElement
    ): Promise<void> {
        const creationArgs = this.createFuncMentioningArgs(astElement);

        const id = Number(astElement.id);
        const declLocation =
            this.activeClassStack.length > 0
                ? this.activeClassStack[this.activeClassStack.length - 1]
                : (this.currentlyAnalyzedFile as db.CppFile);

        const funcMentioning = hasCompoundStmtInInner(astElement)
            ? await declLocation.getOrAddFuncImpl(creationArgs)
            : await declLocation.getOrAddFuncDecl(creationArgs);
        this.funcDeclarations.push({ id, mentioningData: funcMentioning });

        if (hasCompoundStmtInInner(astElement)) {
            this.callingFunc = funcMentioning as cpp.FuncImplementation;
        }
    }

    private createFuncMentioningArgs(
        astElement: clangAst.AstElement
    ): cpp.FuncCreationArgs {
        return {
            funcName: astElement.name!,
            funcAstName: astElement.mangledName!,
            qualType: astElement.type!.qualType,
            range: this.getLocBasedRange(astElement),
        };
    }

    private async createVirtualFuncMentioningArgs(
        astElement: clangAst.AstElement,
        currentClass: cpp.CppClass
    ): Promise<cpp.VirtualFuncCreationArgs> {
        const base = this.createFuncMentioningArgs(astElement);
        const baseFuncAstName = await currentClass.findBaseFunction(
            base.funcName,
            base.qualType
        );

        return {
            funcName: base.funcName,
            funcAstName: base.funcAstName,
            qualType: base.qualType,
            range: base.range,
            baseFuncAstName:
                baseFuncAstName?.getBaseFuncAstName() ?? base.funcAstName,
        };
    }

    private createFuncCallArgs(
        referencedDecl: SimpleFuncDeclaration
    ): cpp.FuncCallCreationArgs {
        return {
            func: referencedDecl.mentioningData,
            range: {
                start: this.lastCallExprBeginLocation,
                end: this.lastCallExprEndLocation,
            },
        };
    }

    private createVirtualFuncCallArgs(
        referencedDecl: SimpleVirtualFuncDeclaration
    ): cpp.VirtualFuncCallCreationArgs {
        return {
            func: referencedDecl.mentioningData,
            range: {
                start: this.lastCallExprBeginLocation,
                end: this.lastCallExprEndLocation,
            },
        };
    }
}
