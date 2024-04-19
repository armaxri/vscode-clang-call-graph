export interface Config {
    getCompileCommandsJsonPath(): string;
    getCallGraphDatabasePath(): string;
    getNumOfParserThreads(): number;

    useDatabaseCaching(): boolean;

    // For development purposes.
    runVerbose(): boolean;
}
