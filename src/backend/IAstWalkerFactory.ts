import * as clang_ast from "./clang_ast_json";
import { IDatabase } from "./IDatabase";
import { IAstWalker } from "./IAstWalker";

export interface IAstWalkerFactory {
    createAstWalker(
        fileName: string,
        database: IDatabase,
        fileReaderFunc: (fileName: string) => clang_ast.AstElement
    ): IAstWalker;
}
