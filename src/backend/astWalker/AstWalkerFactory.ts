import { Database } from "../database/Database";
import { UserInterface } from "../UserInterface";
import { AstWalker } from "./AstWalker";

export interface AstWalkerFactory {
    createAstWalker(
        fileName: string,
        command: string,
        database: Database,
        userInterface: UserInterface
    ): AstWalker | null;
}
