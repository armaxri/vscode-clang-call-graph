import * as clang_ast from "./clang_ast_json";
import { IDatabase } from "./IDatabase";
import { IAstWalker } from "./IAstWalker";

export interface IAstWalkerFactory {
    createAstWalker(
        baseAstElement: clang_ast.AstElement,
        database: IDatabase
    ): IAstWalker;
}
