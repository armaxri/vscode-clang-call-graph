import * as clangAst from "./clang_ast_json";
import { createClangAstCall } from "../../utils/utils";
import * as childProcess from "child_process";
import { UserInterface } from "../../UserInterface";

export function fileReaderFunc(
    command: string,
    userInterface: UserInterface
): clangAst.AstElement {
    const newCommand = createClangAstCall(command);
    const astJson = childProcess.execSync(newCommand.join(" ")).toString();
    const ast = JSON.parse(astJson) as clangAst.AstElement;

    return ast;
}
