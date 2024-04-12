import { IDatabase } from "./IDatabase";

export interface IConfig {
    getCompileCommandsJsonPath(): string;
    getCallGraphDatabasePath(): string;
    getNumOfParserThreads(): number;

    useDatabaseCaching(): boolean;

    // For development purposes.
    runVerbose(): boolean;
}
