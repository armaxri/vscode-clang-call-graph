import { ClangAstWalker } from "./ClangAstWalker";
import { AstWalkerFactory } from "./AstWalkerFactory";
import * as clang_ast from "./clang_ast_json";
import { Database } from "../database/Database";
import { AstWalker } from "./AstWalker";
import { createClangAstCall } from "../utils/utils";
import * as child_process from "child_process";

export class ClangAstWalkerFactory implements AstWalkerFactory {
    createAstWalker(
        fileName: string,
        command: string,
        database: Database
    ): AstWalker {
        return new ClangAstWalker(fileName, database, fileReaderFunc(command));
    }
}

function fileReaderFunc(command: string): clang_ast.AstElement {
    const newCommand = createClangAstCall(command);
    const astJson = child_process.execSync(newCommand.join(" ")).toString();
    const ast = JSON.parse(astJson) as clang_ast.AstElement;

    return ast;
}
