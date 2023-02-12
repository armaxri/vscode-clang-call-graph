import * as clang_ast from "./clang_ast_json";
import { IDatabase, FuncMentioning, FuncCall } from "./IDatabase";

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

export class ClangAstWalker {
    // Sadly we need to cache a few data, which are reported once
    // and no longer until a new value is seen.
    private lastSeenFileNameInFuncDecl: string = "";
    private lastSeenLocLineNumber: number = -1;
    private lastSeenRangeBeginLine: number = -1;

    private callingFuncName: string = "";
    private baseAstElement: clang_ast.AstElement;
    private database: IDatabase;
    private funcDeclarations: Array<SimpleFuncDeclaration> =
        new Array<SimpleFuncDeclaration>();

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
        if (astElement.loc && astElement.loc.file) {
            this.lastSeenFileNameInFuncDecl = astElement.loc.file;
        }
        if (astElement.loc && astElement.loc.line) {
            this.lastSeenLocLineNumber = astElement.loc.line;
        }
        if (astElement.range && astElement.range.begin.line) {
            this.lastSeenRangeBeginLine = astElement.range.begin.line;
        }

        if (astElement.kind === "FunctionDecl") {
            // Function declaration in function declaration is no C++ thing.
            // But still we do this since maybe we one day walk some nice
            // language like python or C++ gets extended.
            const currentCallingFuncName = this.callingFuncName;

            const funcMentioning = this.createFuncMentioning(astElement);
            this.recordFuncDecl(astElement, funcMentioning);

            if (hasCompoundStmtInInner(astElement)) {
                this.database.registerFuncImplementation(funcMentioning);
            } else {
                this.database.registerFuncDeclaration(funcMentioning);
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
        } else {
            if (astElement.kind === "DeclRefExpr") {
                if (astElement.referencedDecl) {
                    const calledFuncId = Number(astElement.referencedDecl.id);
                    const referencedDecl = this.funcDeclarations.find(
                        (funcDec) => funcDec.id === calledFuncId
                    );
                    if (referencedDecl) {
                        const funcCall = this.createFuncCall(
                            astElement,
                            referencedDecl
                        );
                        this.database.registerFuncCall(funcCall);
                    }
                }
            }

            if (astElement.inner) {
                astElement.inner.forEach((newAstElement) =>
                    this.analyzeAstElement(newAstElement)
                );
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
            line: this.lastSeenLocLineNumber,
            columnStart: columnStart,
            columnEnd: columnEnd,
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

    private createFuncCall(
        astElement: clang_ast.AstElement,
        referencedDecl: SimpleFuncDeclaration
    ): FuncCall {
        const columnStart = astElement.range
            ? astElement.range.begin.col
                ? astElement.range.begin.col
                : -1
            : -1;
        const columnEnd =
            columnStart +
            (astElement.range
                ? astElement.range.begin.tokLen
                    ? astElement.range.begin.tokLen
                    : 0
                : 0);
        return {
            callingFuncAstName: this.callingFuncName,
            callDetails: {
                funcName: referencedDecl.mentioningData.funcName,
                funcAstName: referencedDecl.mentioningData.funcAstName,
                file: this.lastSeenFileNameInFuncDecl,
                line: this.lastSeenRangeBeginLine,
                columnStart: columnStart,
                columnEnd: columnEnd,
            },
        };
    }
}
