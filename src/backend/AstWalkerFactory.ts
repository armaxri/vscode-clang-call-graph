import { ClangAstWalker } from "./ClangAstWalker";
import { IAstWalkerFactory } from "./IAstWalkerFactory";
import * as clang_ast from "./clang_ast_json";
import { IDatabase } from "./IDatabase";
import { IAstWalker } from "./IAstWalker";

export class AstWalkerFactory implements IAstWalkerFactory {
    createAstWalker(
        baseAstElement: clang_ast.AstElement,
        database: IDatabase
    ): IAstWalker {
        return new ClangAstWalker(baseAstElement, database);
    }
}
