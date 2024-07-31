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
    private currentlyAnalyzedFile: db.File | undefined = undefined;

    // Sadly we need to cache a few data, which are reported once
    // and no longer until a new value is seen.
    private lastSeenLocLineNumber: number = -1;
    private lastSeenRangeBeginLine: number = -1;
    private lastSeenRangeEndLine: number = -1;
    private lastCallExprBeginLocation: cpp.Location = { line: -1, column: -1 };
    private lastCallExprEndLocation: cpp.Location = { line: -1, column: -1 };

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

    walkAst() {
        try {
            if (this.baseAstElement.kind !== "TranslationUnitDecl") {
                console.error(
                    `Expected TranslationUnitDecl, got "${this.baseAstElement.kind}" as first element in file "${this.fileName}".`
                );
                // TODO: Report to user an internal error.
                return;
            }

            const startTime = Date.now();

            if (this.baseAstElement.inner) {
                for (const innerAstElement of this.baseAstElement.inner) {
                    this.handleFileLocation(innerAstElement);

                    // We don't want to record built-in functions. They are not interesting for users.
                    if (this.currentlyAnalyzedFile !== undefined) {
                        this.analyzeAstElement(innerAstElement);
                    }
                }
            }

            this.currentlyAnalyzedFile?.justAnalyzed();
            this.database.writeDatabase();

            const endTime = Date.now();
            const elapsedTime = endTime - startTime;
            console.log(
                `Took ${elapsedTime}ms to analyze file "${this.fileName}".`
            );
        } catch (error) {
            console.error(
                `Internal error during analysis of file "${this.fileName}": ${error}`
            );
            // TODO: Report to user an internal error.
        }
    }

    private analyzeAstElement(astElement: clangAst.AstElement) {
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
                for (const newAstElement of astElement.inner) {
                    this.analyzeAstElement(newAstElement);
                }
            }
        }
    }

    private handleFileLocation(astElement: clangAst.AstElement) {
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
                ).addReferencedFromFile(this.fileName);

                if (
                    astElement.loc.includedFrom &&
                    astElement.loc.includedFrom.file
                ) {
                    (
                        this.currentlyAnalyzedFile as db.HppFile
                    ).addReferencedFromFile(astElement.loc.includedFrom.file);
                }
            }
        }
    }

    private handleLocAndRange(astElement: clangAst.AstElement) {
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
    ): cpp.Location {
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
                    : // istanbul ignore next
                      -1,
        };
    }

    private getRangeEndLocation(astElement: clangAst.AstElement): cpp.Location {
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
                          : // istanbul ignore next
                            0)
                    : // istanbul ignore next
                      -1,
        };
    }

    private getLocBasedRangeStartLocation(
        astElement: clangAst.AstElement
    ): cpp.Location {
        return {
            line: this.lastSeenLocLineNumber,
            column: astElement.loc
                ? astElement.loc.col
                    ? astElement.loc.col
                    : // istanbul ignore next
                      -1
                : // istanbul ignore next
                  -1,
        };
    }

    private getLocBasedRangeEndLocation(
        astElement: clangAst.AstElement,
        startLocation: cpp.Location
    ): cpp.Location {
        return {
            line: this.lastSeenLocLineNumber,
            column:
                startLocation.column +
                (astElement.loc
                    ? astElement.loc.tokLen
                        ? astElement.loc.tokLen
                        : // istanbul ignore next
                          0
                    : // istanbul ignore next
                      0),
        };
    }

    private getLocBasedRange(astElement: clangAst.AstElement): cpp.Range {
        const startLocation = this.getLocBasedRangeStartLocation(astElement);
        return {
            start: startLocation,
            end: this.getLocBasedRangeEndLocation(astElement, startLocation),
        };
    }

    private handleClassDecl(astElement: clangAst.AstElement) {
        if (astElement.name === undefined || astElement.name === "") {
            return;
        }

        if (astElement.name.startsWith("__")) {
            // These are internal classes, which are not interesting for the user.
            return;
        }

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
                if (foundClass && !foundClass.getName().startsWith("__")) {
                    newClass.getOrAddParentClass(foundClass);
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
                    this.analyzeAstElement(newAstElement);
                }
            }
        }

        this.activeClassStack.pop();
    }

    private handleFunctionDecl(astElement: clangAst.AstElement) {
        if (astElement.name!.startsWith("__builtin_")) {
            // These are internal functions, which are not interesting for the user.
            return;
        }

        // Function declaration in function declaration is no C++ thing.
        // But still we do this since maybe we one day walk some nice
        // language like python or C++ gets extended.
        const currentCallingFuncName = this.callingFunc;

        if (isElementVirtualFuncDeclaration(astElement)) {
            // Skip some internal virtual functions.
            if (this.activeClassStack.length !== 0) {
                this.handleVirtualFuncDecl(astElement);
            }
        } else {
            this.handleFuncDecl(astElement);
        }

        if (astElement.inner) {
            for (const newAstElement of astElement.inner) {
                this.analyzeAstElement(newAstElement);
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
            : // istanbul ignore next
              undefined;
        if (calledFuncId) {
            const referencedDecl = this.funcDeclarations.find(
                (funcDec) => funcDec.id === Number(calledFuncId)
            );
            if (referencedDecl) {
                const funcCall = this.createFuncCallArgs(referencedDecl);
                this.callingFunc?.getOrAddFuncCall(funcCall);
            } else {
                const referencedVirtualDecl = this.virtualFuncDeclarations.find(
                    (funcDec) => funcDec.id === Number(calledFuncId)
                );
                if (referencedVirtualDecl) {
                    const funcCall = this.createVirtualFuncCallArgs(
                        referencedVirtualDecl
                    );
                    this.callingFunc?.getOrAddVirtualFuncCall(funcCall);
                }
            }
        }
    }

    private handleVirtualFuncDecl(astElement: clangAst.AstElement) {
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

    private handleFuncDecl(astElement: clangAst.AstElement): void {
        if (
            astElement.name === undefined ||
            astElement.name === "" ||
            astElement.mangledName === undefined ||
            astElement.mangledName === ""
        ) {
            return;
        }

        const creationArgs = this.createFuncMentioningArgs(astElement);

        const id = Number(astElement.id);
        const declLocation =
            this.activeClassStack.length > 0
                ? this.activeClassStack[this.activeClassStack.length - 1]
                : (this.currentlyAnalyzedFile as db.File);

        const funcMentioning = hasCompoundStmtInInner(astElement)
            ? declLocation.getOrAddFuncImpl(creationArgs)
            : declLocation.getOrAddFuncDecl(creationArgs);
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

    private createVirtualFuncMentioningArgs(
        astElement: clangAst.AstElement,
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
                start: {
                    line:
                        this.lastCallExprBeginLocation.line !== -1
                            ? this.lastCallExprBeginLocation.line
                            : this.lastSeenLocLineNumber,
                    column: this.lastCallExprBeginLocation.column,
                },
                end: {
                    line:
                        this.lastCallExprEndLocation.line !== -1
                            ? this.lastCallExprEndLocation.line
                            : this.lastSeenLocLineNumber,
                    column: this.lastCallExprEndLocation.column,
                },
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
