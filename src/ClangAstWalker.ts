import * as clang_ast from "./clang_ast_json";
import {
    IDatabase,
    FuncMentioning,
    FuncCall,
    Location,
    VirtualFuncMentioning,
    VirtualFuncCall,
} from "./IDatabase";

function hasCompoundStmtInInner(astElement: clang_ast.AstElement): boolean {
    if (astElement.inner) {
        const matches = astElement.inner.filter(
            (element) => element.kind === "CompoundStmt"
        );

        return matches.length > 0;
    }
    return false;
}

// Function calls refer to previous declarations by id.
// Therefore declarations need to be stored during the run
// and can be thrown away later.
type SimpleFuncDeclaration = {
    id: number;
    mentioningData: FuncMentioning;
};
type SimpleVirtualFuncDeclaration = {
    id: number;
    mentioningData: VirtualFuncMentioning;
};

function isElementVirtualFuncDeclaration(
    element: clang_ast.AstElement
): boolean {
    const hasOtherAttribute: boolean = element.inner
        ? element.inner.some(
              (innerElement) =>
                  innerElement.kind === "CXXFinalAttr" ||
                  innerElement.kind === "OverrideAttr"
          )
        : false;
    return (
        element.kind === "CXXMethodDecl" &&
        (element.virtual === true || hasOtherAttribute)
    );
}

export class ClangAstWalker {
    // Sadly we need to cache a few data, which are reported once
    // and no longer until a new value is seen.
    private lastSeenFileNameInFuncDecl: string = "";
    private lastSeenLocLineNumber: number = -1;
    private lastSeenRangeBeginLine: number = -1;
    private lastSeenRangeEndLine: number = -1;
    private lastCallExprBeginLocation: Location = { line: -1, column: -1 };
    private lastCallExprEndLocation: Location = { line: -1, column: -1 };

    private callingFuncName: string = "";
    private baseAstElement: clang_ast.AstElement;
    private database: IDatabase;
    private funcDeclarations: Array<SimpleFuncDeclaration> =
        new Array<SimpleFuncDeclaration>();
    private virtualFuncDeclarations: Array<SimpleVirtualFuncDeclaration> =
        new Array<SimpleVirtualFuncDeclaration>();

    constructor(baseAstElement: clang_ast.AstElement, database: IDatabase) {
        this.baseAstElement = baseAstElement;
        this.database = database;
    }

    public walkAst() {
        this.analyzeAstElement(this.baseAstElement);
    }

    private analyzeAstElement(astElement: clang_ast.AstElement) {
        // The file name and the source line are only mentioned in the first
        // seen element of the file.
        // Therefore we need to cache the value.
        this.handleLocAndRange(astElement);

        if (
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
            this.lastSeenFileNameInFuncDecl = astElement.loc.file;
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

    private handleFunctionDecl(astElement: clang_ast.AstElement) {
        // Function declaration in function declaration is no C++ thing.
        // But still we do this since maybe we one day walk some nice
        // language like python or C++ gets extended.
            const currentCallingFuncName = this.callingFuncName;

            if (isElementVirtualFuncDeclaration(astElement)) {
                const virtualFuncMentioning =
                    this.createVirtualFuncMentioning(astElement);
                this.recordVirtualFuncDecl(astElement, virtualFuncMentioning);

                if (hasCompoundStmtInInner(astElement)) {
                    this.database.registerVirtualFuncImplementation(
                        virtualFuncMentioning
                    );
                } else {
                    this.database.registerVirtualFuncDeclaration(
                        virtualFuncMentioning
                    );
                }
            } else {
                const funcMentioning = this.createFuncMentioning(astElement);
                this.recordFuncDecl(astElement, funcMentioning);

                if (hasCompoundStmtInInner(astElement)) {
                    this.database.registerFuncImplementation(funcMentioning);
                } else {
                    this.database.registerFuncDeclaration(funcMentioning);
                }
            }

            this.callingFuncName =
                typeof astElement.mangledName === "string"
                    ? astElement.mangledName
                    : "";

            if (astElement.inner) {
                astElement.inner.forEach((newAstElement) =>
                    this.analyzeAstElement(newAstElement)
                );
        }

        this.callingFuncName = currentCallingFuncName;
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
                        const funcCall = this.createFuncCall(
                            astElement,
                            referencedDecl
                );
                this.database.registerFuncCall(funcCall);
            }
            const referencedVirtualDecl = this.virtualFuncDeclarations.find(
                (funcDec) => funcDec.id === Number(calledFuncId)
            );
            if (referencedVirtualDecl) {
                        const funcCall = this.createVirtualFuncCall(
                            astElement,
                            referencedVirtualDecl
                        );
                        this.database.registerVirtualFuncCall(funcCall);
                    }
        }
    }

    private createFuncMentioning(
        astElement: clang_ast.AstElement
    ): FuncMentioning {
        const columnStart = astElement.loc
            ? astElement.loc.col
                ? astElement.loc.col
                : -1
            : -1;
        const columnEnd =
            columnStart +
            (astElement.loc
                ? astElement.loc.tokLen
                    ? astElement.loc.tokLen
                    : 0
                : 0);
        return {
            funcName: astElement.name
                ? astElement.name
                : "Error! No name present.",
            funcAstName: astElement.mangledName
                ? astElement.mangledName
                : "Error! No mangledName present.",
            file: this.lastSeenFileNameInFuncDecl,
            startLoc: {
                line: this.lastSeenLocLineNumber,
                column: columnStart,
            },
            endLoc: {
                line: this.lastSeenLocLineNumber,
                column: columnEnd,
            },
        };
    }

    private createVirtualFuncMentioning(
        astElement: clang_ast.AstElement
    ): VirtualFuncMentioning {
        const funcMentioning = this.createFuncMentioning(astElement);
        return {
            baseFuncAstName: funcMentioning.funcAstName,
            funcImpl: funcMentioning,
        };
    }

    private getRangeStartLocation(astElement: clang_ast.AstElement): Location {
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

    private getRangeEndLocation(astElement: clang_ast.AstElement): Location {
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

    private recordFuncDecl(
        astElement: clang_ast.AstElement,
        funcMentioning: FuncMentioning
    ) {
        const newDecl: SimpleFuncDeclaration = {
            id: Number(astElement.id),
            mentioningData: funcMentioning,
        };

        this.funcDeclarations.push(newDecl);
    }

    private recordVirtualFuncDecl(
        astElement: clang_ast.AstElement,
        funcMentioning: VirtualFuncMentioning
    ) {
        const newDecl: SimpleVirtualFuncDeclaration = {
            id: Number(astElement.id),
            mentioningData: funcMentioning,
        };

        this.virtualFuncDeclarations.push(newDecl);
    }

    private updateLastCallExprLocation(astElement: clang_ast.AstElement) {
        this.lastCallExprBeginLocation = this.getRangeStartLocation(astElement);
        this.lastCallExprEndLocation = this.getRangeEndLocation(astElement);
    }

    private createFuncCall(
        astElement: clang_ast.AstElement,
        referencedDecl: SimpleFuncDeclaration
    ): FuncCall {
        return {
            callingFuncAstName: this.callingFuncName,
            callDetails: {
                funcName: referencedDecl.mentioningData.funcName,
                funcAstName: referencedDecl.mentioningData.funcAstName,
                file: this.lastSeenFileNameInFuncDecl,
                startLoc: this.lastCallExprBeginLocation,
                endLoc: this.lastCallExprEndLocation,
            },
        };
    }

    private createVirtualFuncCall(
        astElement: clang_ast.AstElement,
        referencedDecl: SimpleVirtualFuncDeclaration
    ): VirtualFuncCall {
        return {
            callingFuncAstName: this.callingFuncName,
            baseFuncAstName: referencedDecl.mentioningData.baseFuncAstName,
            callDetails: {
                funcName: referencedDecl.mentioningData.funcImpl.funcName,
                funcAstName: referencedDecl.mentioningData.funcImpl.funcAstName,
                file: this.lastSeenFileNameInFuncDecl,
                startLoc: this.lastCallExprBeginLocation,
                endLoc: this.lastCallExprEndLocation,
            },
        };
    }
}
