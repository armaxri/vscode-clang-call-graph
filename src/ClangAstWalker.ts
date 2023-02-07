import * as clang_ast from "./clang_ast_json";
import { IDatabase, FuncMentioning } from "./IDatabase";

function createFuncMentioning(
    astElement: clang_ast.AstElement
): FuncMentioning {
    const funcName = astElement.name
        ? astElement.name
        : "Error! No name present.";
    const funcAstName = astElement.mangledName
        ? astElement.mangledName
        : "Error! No mangledName present.";
    const file = astElement.loc
        ? astElement.loc.file
            ? astElement.loc.file
            : "Error! No file location present."
        : "Error! No location present.";
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
            const funcMentioning = createFuncMentioning(astElement);

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
}
