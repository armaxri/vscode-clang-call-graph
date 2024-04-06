import { ClangAstWalker } from "./ClangAstWalker";
import { IAstWalkerFactory } from "./IAstWalkerFactory";
import * as clang_ast from "./clang_ast_json";
import { IDatabase } from "./IDatabase";
import { IAstWalker } from "./IAstWalker";

export class AstWalkerFactory implements IAstWalkerFactory {
    createAstWalker(
        fileName: string,
        database: IDatabase,
        fileReaderFunc: (fileName: string) => clang_ast.AstElement
    ): IAstWalker {
        return new ClangAstWalker(fileName, database, fileReaderFunc(fileName));
    }
}
