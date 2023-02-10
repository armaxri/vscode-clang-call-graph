import * as clang_ast from "./clang_ast_json";
import { IDatabase, FuncMentioning } from "./IDatabase";

function hasCompoundStmtInInner(astElement: clang_ast.AstElement): boolean {
    if (astElement.inner) {
        const matches = astElement.inner.filter(
            (element) => element.kind === "CompoundStmt"
        );

        return matches.length > 0;
    }
    return false;
}

export class ClangAstWalker {
    private currentlyInFuncDecl: boolean = false;
    private callingFuncName: string = "";
    private lastSeenFileNameInFuncDecl: string = "";
    private baseAstElement: clang_ast.AstElement;
    private database: IDatabase;

    constructor(baseAstElement: clang_ast.AstElement, database: IDatabase) {
        this.baseAstElement = baseAstElement;
        this.database = database;
    }

    public walkAst() {
        this.analyzeAstElement(this.baseAstElement);
    }

    private analyzeAstElement(astElement: clang_ast.AstElement) {
        if (astElement.kind === "FunctionDecl") {
            // The file name is only mentioned in the first "FunctionDecl" of the file.
            // Therefore we need to cache the value.
            if (astElement.loc && astElement.loc.file) {
                this.lastSeenFileNameInFuncDecl = astElement.loc.file;
            }

            const funcMentioning = this.createFuncMentioning(astElement);

            if (hasCompoundStmtInInner(astElement)) {
                this.database.registerFuncImplementation(funcMentioning);
            } else {
                this.database.registerFuncDeclaration(funcMentioning);
            }

            this.currentlyInFuncDecl = true;
            this.callingFuncName =
                typeof astElement.mangledName === "string"
                    ? astElement.mangledName
                    : "";
        }

        if (astElement.inner) {
            astElement.inner.forEach((newAstElement) =>
                this.analyzeAstElement(newAstElement)
            );
        }

        if (astElement.kind === "FunctionDecl") {
            this.currentlyInFuncDecl = false;
        }
    }

    private createFuncMentioning(
        astElement: clang_ast.AstElement
    ): FuncMentioning {
        const funcName = astElement.name
            ? astElement.name
            : "Error! No name present.";
        const funcAstName = astElement.mangledName
            ? astElement.mangledName
            : "Error! No mangledName present.";
        const file = this.lastSeenFileNameInFuncDecl;
        const line = astElement.loc
            ? astElement.loc.line
                ? astElement.loc.line
                : -1
            : -1;
        const columnStart = astElement.loc
            ? astElement.loc.col
                ? astElement.loc.col
                : -1
            : -1;
        const columnEnd = astElement.loc
            ? astElement.loc.tokLen
                ? columnStart + astElement.loc.tokLen
                : -1
            : -1;
        return { funcName, funcAstName, file, line, columnStart, columnEnd };
    }
}
