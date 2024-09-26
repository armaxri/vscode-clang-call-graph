import { ClangAstWalker } from "./ClangAstWalker";
import { AstWalkerFactory } from "../AstWalkerFactory";
import { Database } from "../../database/Database";
import { AstWalker } from "../AstWalker";
import { fileReaderFunc } from "./clang_file_reader_func";
import { FileAnalysisHandle } from "../FileAnalysisHandle";

export class ClangAstWalkerFactory implements AstWalkerFactory {
    createAstWalker(
        database: Database,
        fileHandle: FileAnalysisHandle
    ): AstWalker | null {
        const ast = fileReaderFunc(fileHandle);

        if (ast !== null) {
            return new ClangAstWalker(fileHandle, database, ast);
        }

        return null;
    }
}
