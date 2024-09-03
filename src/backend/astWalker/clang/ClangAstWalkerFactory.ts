import { ClangAstWalker } from "./ClangAstWalker";
import { AstWalkerFactory } from "../AstWalkerFactory";
import { Database } from "../../database/Database";
import { AstWalker } from "../AstWalker";
import { UserInterface } from "../../UserInterface";
import { fileReaderFunc } from "./clang_file_reader_func";

export class ClangAstWalkerFactory implements AstWalkerFactory {
    createAstWalker(
        fileName: string,
        command: string,
        database: Database,
        userInterface: UserInterface
    ): AstWalker {
        return new ClangAstWalker(
            fileName,
            database,
            fileReaderFunc(command, userInterface)
        );
    }
}
