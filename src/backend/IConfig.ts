import { IDatabase } from "./IDatabase";

export interface IConfig {
    getCompileCommandsJsonPath(): string;
    getCallGraphDatabasePath(): string;
    getNumOfParserThreads(): number;

    // For development purposes.
    runVerbose(): boolean;
}
