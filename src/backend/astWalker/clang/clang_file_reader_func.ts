import * as clangAst from "./clang_ast_json";
import { createClangAstCall } from "../../utils/utils";
import * as childProcess from "child_process";
import { FileAnalysisHandle } from "../FileAnalysisHandle";

export function fileReaderFunc(
    fileHandle: FileAnalysisHandle
): clangAst.AstElement | null {
    const newCommand = createClangAstCall(fileHandle.getCommand());

    var processOutput: string;

    try {
        processOutput = childProcess.execSync(newCommand.join(" ")).toString();
    } catch (error) {
        fileHandle.handleFileParsingError(error as string);

        return null;
    }

    try {
        const ast = JSON.parse(processOutput) as clangAst.AstElement;
        return ast;
    } catch (error) {
        fileHandle.handleFileParsingError(error as string);
    }

    return null;
}
