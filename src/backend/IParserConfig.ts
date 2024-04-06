import { IDatabase } from "./IDatabase";

export interface IParserConfig {
    getCompileCommandsJsonPath(): string;
    getCallGraphDatabasePath(): string;
    getNumOfParserThreads(): number;
    getDatabase(): IDatabase;
}
