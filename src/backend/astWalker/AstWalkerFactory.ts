import { Database } from "../database/Database";
import { AstWalker } from "./AstWalker";
import { FileAnalysisHandle } from "./FileAnalysisHandle";

export interface AstWalkerFactory {
    createAstWalker(
        database: Database,
        fileHandle: FileAnalysisHandle
    ): AstWalker | null;
}
