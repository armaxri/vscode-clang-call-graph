import * as clangAst from "./clang_ast_json";
import { createClangAstCall } from "../../utils/utils";
import * as childProcess from "child_process";
import { UserInterface } from "../../UserInterface";

export function fileReaderFunc(
    fileName: string,
    command: string,
    userInterface: UserInterface
): clangAst.AstElement | null {
    const newCommand = createClangAstCall(command);

    var processOutput: string;

    try {
        processOutput = childProcess.execSync(newCommand.join(" ")).toString();
    } catch (error) {
        userInterface.displayError(
            `Error on parsing file "${fileName}" using command "${command}" resulting error message: ${error}`
        );

        return null;
    }

    try {
        const ast = JSON.parse(processOutput) as clangAst.AstElement;
        return ast;
    } catch (error) {
        userInterface.displayError(
            `Error on parsing file "${fileName}" using command "${command}" resulting error message: ${error}`
        );
    }

    return null;
}
