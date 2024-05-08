import { ClangAstWalker } from "./ClangAstWalker";
import { AstWalkerFactory } from "../AstWalkerFactory";
import * as clangAst from "./clang_ast_json";
import { Database } from "../../database/Database";
import { AstWalker } from "../AstWalker";
import { createClangAstCall } from "../../utils/utils";
import * as childProcess from "child_process";

export class ClangAstWalkerFactory implements AstWalkerFactory {
    createAstWalker(
        fileName: string,
        command: string,
        database: Database
    ): AstWalker {
        return new ClangAstWalker(fileName, database, fileReaderFunc(command));
    }
}

function fileReaderFunc(command: string): clangAst.AstElement {
    const newCommand = createClangAstCall(command);
    const astJson = childProcess.execSync(newCommand.join(" ")).toString();
    const ast = JSON.parse(astJson) as clangAst.AstElement;

    return ast;
}
