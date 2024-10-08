import * as clangAst from "./clang_ast_json";
import {
    hasCompoundStmtInInner,
    isElementVirtualFuncDeclaration,
} from "./clang_ast_json_helper";
import * as db from "../../database/Database";
import * as cpp from "../../database/cpp_structure";
import { AstWalker } from "../AstWalker";
import { FileAnalysisHandle } from "../FileAnalysisHandle";

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

// In case of template classes, we need to delay the function call creation.
type DelayedFuncCall = {
    calledFuncId: number;
    funcImplementation: cpp.FuncImplementation;
};

export class ClangAstWalker implements AstWalker {
    private fileHandle: FileAnalysisHandle;
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
    private delayedFuncCalls: DelayedFuncCall[] = [];

    private funcDeclarations: SimpleFuncDeclaration[] = [];
    private virtualFuncDeclarations: SimpleVirtualFuncDeclaration[] = [];

    constructor(
        fileHandle: FileAnalysisHandle,
        database: db.Database,
        baseAstElement: clangAst.AstElement
    ) {
        this.fileHandle = fileHandle;
        this.database = database;
        this.baseAstElement = baseAstElement;
    }

    walkAst() {
        try {
            if (this.baseAstElement.kind !== "TranslationUnitDecl") {
                this.fileHandle.handleFileWalkingError(
                    `Expected TranslationUnitDecl, got "${this.baseAstElement.kind}" as first element.`
                );
                return;
            }

            const startTime = Date.now();

            // Create the file in the database, so that we can reference it.
            this.database.getOrAddCppFile(this.fileHandle.getFileName());

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
            this.fileHandle.fileHandledSuccessfully(elapsedTime);
        } catch (error) {
            this.fileHandle.handleFileWalkingError(error as string);
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
        } else if (astElement.kind === "ClassTemplateSpecializationDecl") {
            this.handleTemplateClassSpecialization(astElement);
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

            if (astElement.loc.file === this.fileHandle.getFileName()) {
                this.currentlyAnalyzedFile = this.database.getOrAddCppFile(
                    this.fileHandle.getFileName()
                );
            } else {
                this.currentlyAnalyzedFile = this.database.getOrAddHppFile(
                    astElement.loc.file
                );

                (
                    this.currentlyAnalyzedFile as db.HppFile
                ).addReferencedFromFile(this.fileHandle.getFileName());

                if (
                    astElement.loc.includedFrom &&
                    astElement.loc.includedFrom.file &&
                    astElement.loc.includedFrom.file !==
                        this.fileHandle.getFileName()
                ) {
                    // Ensure that the file exists in the database.
                    const hppFile = this.database.getOrAddHppFile(
                        astElement.loc.includedFrom.file
                    );

                    (
                        this.currentlyAnalyzedFile as db.HppFile
                    ).addReferencedFromFile(hppFile.getName());
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

        if (astElement.name.startsWith("__") || astElement?.isImplicit) {
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

    private handleTemplateClassSpecialization(astElement: clangAst.AstElement) {
        const templateClass = this.knownClasses.find(
            (knownClass) => knownClass.getName() === astElement.name
        );

        if (templateClass) {
            this.activeClassStack.push(templateClass);

            if (astElement.inner) {
                for (const newAstElement of astElement.inner) {
                    this.analyzeAstElement(newAstElement);
                }
            }

            this.activeClassStack.pop();
        }
        // The following is a fallback, if the template class is not known.
        // This is not a realistic scenario and should not happen.
        // istanbul ignore next
        else {
            // istanbul ignore next
            if (!astElement.name?.startsWith("__")) {
                // istanbul ignore next
                this.fileHandle.logInternalError(
                    `Template class "${astElement.name}" is not known.`
                );
            }
        }
    }

    private handleExprStmt(astElement: clangAst.AstElement) {
        const calledFuncId: string | undefined = astElement.referencedDecl
            ? astElement.kind === "DeclRefExpr"
                ? astElement.referencedDecl.id
                : // istanbul ignore next
                  undefined // could be astElement.referencedMemberDecl
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
                } else {
                    // In case of template classes, we need to delay the function call creation.
                    const delayedFuncCall: DelayedFuncCall = {
                        calledFuncId: Number(calledFuncId),
                        funcImplementation: this.callingFunc!,
                    };
                    this.delayedFuncCalls.push(delayedFuncCall);
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

        this.delayedFuncCalls.forEach((delayedFuncCall) => {
            if (delayedFuncCall.calledFuncId === id) {
                const funcCall = this.createVirtualFuncCallArgs({
                    id,
                    mentioningData: virtualFuncMentioning,
                });
                delayedFuncCall.funcImplementation.getOrAddVirtualFuncCall(
                    funcCall
                );
            }
        });
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

        this.delayedFuncCalls.forEach((delayedFuncCall) => {
            if (delayedFuncCall.calledFuncId === id) {
                const funcCall = this.createFuncCallArgs({
                    id,
                    mentioningData: funcMentioning,
                });
                delayedFuncCall.funcImplementation.getOrAddFuncCall(funcCall);
            }
        });
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
