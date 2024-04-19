import { IDatabase } from "../database/IDatabase";
import { AstWalker } from "./AstWalker";

export interface AstWalkerFactory {
    createAstWalker(
        fileName: string,
        command: string,
        database: IDatabase
    ): AstWalker;
}
