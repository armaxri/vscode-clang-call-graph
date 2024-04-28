import * as clang_ast from "./clang_ast_json";
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
    private baseAstElement: clang_ast.AstElement;

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
        baseAstElement: clang_ast.AstElement
    ) {
        this.fileName = fileName;
        this.database = database;
        this.baseAstElement = baseAstElement;
    }

    walkAst(): void {
        this.analyzeAstElement(this.baseAstElement);

        this.currentlyAnalyzedFile?.justAnalyzed();
        this.database.writeDatabase();
    }

    getFileName(): string {
        return this.fileName;
    }

    private analyzeAstElement(astElement: clang_ast.AstElement) {
        // The file name and the source line are only mentioned in the first
        // seen element of the file.
        // Therefore we need to cache the value.
        this.handleLocAndRange(astElement);

        if (astElement.kind === "CXXRecordDecl") {
            this.handleClassDecl(astElement);
        } else if (
            astElement.kind === "FunctionDecl" ||
            astElement.kind === "CXXMethodDecl"
        ) {
            this.handleFunctionDecl(astElement);
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
                astElement.inner.forEach((newAstElement) =>
                    this.analyzeAstElement(newAstElement)
                );
            }
        }
    }

    private handleLocAndRange(astElement: clang_ast.AstElement) {
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

    private updateLastCallExprLocation(astElement: clang_ast.AstElement) {
        this.lastCallExprBeginLocation = this.getRangeStartLocation(astElement);
        this.lastCallExprEndLocation = this.getRangeEndLocation(astElement);
    }

    private getRangeStartLocation(
        astElement: clang_ast.AstElement
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

    private getRangeEndLocation(astElement: clang_ast.AstElement): db.Location {
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

    private getRange(astElement: clang_ast.AstElement): db.Range {
        return {
            start: this.getRangeStartLocation(astElement),
            end: this.getRangeEndLocation(astElement),
        };
    }

    private getLocBasedRangeStartLocation(
        astElement: clang_ast.AstElement
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
        astElement: clang_ast.AstElement,
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

    private getLocBasedRange(astElement: clang_ast.AstElement): db.Range {
        const startLocation = this.getLocBasedRangeStartLocation(astElement);
        return {
            start: startLocation,
            end: this.getLocBasedRangeEndLocation(astElement, startLocation),
        };
    }

    private handleClassDecl(astElement: clang_ast.AstElement) {
        const newClass =
            this.activeClassStack.length === 0
                ? this.currentlyAnalyzedFile!.getOrAddClass(astElement.name!)
                : this.activeClassStack[
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
            astElement.inner.forEach((newAstElement) => {
                // There are class mirrors in the class directly on the first level.
                // This phantom element should be filtered out.
                if (
                    !(
                        newAstElement.kind === "CXXRecordDecl" &&
                        newAstElement.name === newClass.getName()
                    )
                ) {
                    this.analyzeAstElement(newAstElement);
                }
            });
        }

        this.activeClassStack.pop();
    }

    private handleFunctionDecl(astElement: clang_ast.AstElement) {
        // Function declaration in function declaration is no C++ thing.
        // But still we do this since maybe we one day walk some nice
        // language like python or C++ gets extended.
        const currentCallingFuncName = this.callingFunc;

        if (isElementVirtualFuncDeclaration(astElement)) {
            this.handleVirtualFuncDecl(astElement);
        } else {
            this.handleFuncDecl(astElement);
        }

        if (astElement.inner) {
            astElement.inner.forEach((newAstElement) =>
                this.analyzeAstElement(newAstElement)
            );
        }

        this.callingFunc = currentCallingFuncName;
    }

    private handleExprStmt(astElement: clang_ast.AstElement) {
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

    private handleVirtualFuncDecl(astElement: clang_ast.AstElement) {
        const currentClass =
            this.activeClassStack[this.activeClassStack.length - 1];

        const creationArgs = this.createVirtualFuncMentioningArgs(
            astElement,
            currentClass
        );

        const id = Number(astElement.id);
        const virtualFuncMentioning = hasCompoundStmtInInner(astElement)
            ? currentClass.getOrAddVirtualFuncImpl(creationArgs)
            : currentClass.getOrAddVirtualFuncDecl(creationArgs);

        this.virtualFuncDeclarations.push({
            id,
            mentioningData: virtualFuncMentioning,
        });

        if (hasCompoundStmtInInner(astElement)) {
            this.callingFunc =
                virtualFuncMentioning as cpp.VirtualFuncImplementation;
        }
    }

    private handleFuncDecl(astElement: clang_ast.AstElement) {
        const creationArgs = this.createFuncMentioningArgs(astElement);

        const id = Number(astElement.id);
        const declLocation =
            this.activeClassStack.length > 0
                ? this.activeClassStack[this.activeClassStack.length - 1]
                : (this.currentlyAnalyzedFile as db.CppFile);

        const funcMentioning = hasCompoundStmtInInner(astElement)
            ? declLocation.getOrAddFuncImpl(creationArgs)
            : declLocation.getOrAddFuncDecl(creationArgs);
        this.funcDeclarations.push({ id, mentioningData: funcMentioning });

        if (hasCompoundStmtInInner(astElement)) {
            this.callingFunc = funcMentioning as cpp.FuncImplementation;
        }
    }

    private createFuncMentioningArgs(
        astElement: clang_ast.AstElement
    ): cpp.FuncCreationArgs {
        return {
            funcName: astElement.name!,
            funcAstName: astElement.mangledName!,
            qualType: astElement.type!.qualType,
            range: this.getLocBasedRange(astElement),
        };
    }

    private createVirtualFuncMentioningArgs(
        astElement: clang_ast.AstElement,
        currentClass: cpp.CppClass
    ): cpp.VirtualFuncCreationArgs {
        const base = this.createFuncMentioningArgs(astElement);
        const baseFuncAstName = currentClass.findBaseFunction(
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
