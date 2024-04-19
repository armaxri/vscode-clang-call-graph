import { Database } from "../database/Database";
import { AstWalker } from "./AstWalker";

export interface AstWalkerFactory {
    createAstWalker(
        fileName: string,
        command: string,
        database: Database
    ): AstWalker;
}
