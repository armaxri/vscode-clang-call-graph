import { IDatabase } from "./IDatabase";

export interface IConfig {
    getCompileCommandsJsonPath(): string;
    getCallGraphDatabasePath(): string;
    getNumOfParserThreads(): number;
    getDatabase(): IDatabase;

    // Additional functions that are used to signal a user of the application. This may differ between the GUI and the CLI.
    displayError(message: string): void;
}
