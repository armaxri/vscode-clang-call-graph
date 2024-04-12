import { ClangAstWalker } from "./ClangAstWalker";
import { IAstWalkerFactory } from "./IAstWalkerFactory";
import * as clang_ast from "./clang_ast_json";
import { IDatabase } from "./IDatabase";
import { IAstWalker } from "./IAstWalker";
import { createClangAstCall } from "./utils/utils";
import * as child_process from "child_process";

export class ClangAstWalkerFactory implements IAstWalkerFactory {
    createAstWalker(
        fileName: string,
        command: string,
        database: IDatabase
    ): IAstWalker {
        return new ClangAstWalker(fileName, database, fileReaderFunc(command));
    }
}

function fileReaderFunc(command: string): clang_ast.AstElement {
    const newCommand = createClangAstCall(command);
    const astJson = child_process.execSync(newCommand.join(" ")).toString();
    const ast = JSON.parse(astJson) as clang_ast.AstElement;

    return ast;
}
