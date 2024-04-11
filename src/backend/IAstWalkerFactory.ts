import { IDatabase } from "./IDatabase";
import { IAstWalker } from "./IAstWalker";

export interface IAstWalkerFactory {
    createAstWalker(
        fileName: string,
        command: string,
        database: IDatabase
    ): IAstWalker;
}
