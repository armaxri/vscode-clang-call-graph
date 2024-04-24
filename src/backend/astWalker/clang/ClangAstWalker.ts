import * as clang_ast from "../clang/clang_ast_json";
import * as db from "../../database/Database";
import { AstWalker } from "../AstWalker";

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

    private handleClassDecl(astElement: clang_ast.AstElement) {
        throw new Error("Method not implemented.");
    }

    private handleFunctionDecl(astElement: clang_ast.AstElement) {
        throw new Error("Method not implemented.");
    }

    private handleExprStmt(astElement: clang_ast.AstElement) {
        throw new Error("Method not implemented.");
    }
}
