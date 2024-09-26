import { Config, DatabaseType } from "../../../backend/Config";
import { adjustTsToJsPath } from "./path_helper";

export class MockConfig extends Config {
    private testDir: string = "";

    constructor(
        testDir: string,
        databaseType: DatabaseType = DatabaseType.lowdb,
        lowdbDatabaseName?: string,
        compileCommandsJsonName?: string
    ) {
        super();

        this.testDir = adjustTsToJsPath(testDir);
        this.numOfParserThreads = 1;
        this.databaseType = databaseType;
        this.lowdbDatabaseName =
            lowdbDatabaseName ?? super.getLowdbDatabaseName();
        this.compileCommandsJsonName =
            compileCommandsJsonName ?? super.getCompileCommandsJsonName();
        this.verbose = true;

        // We don't need to actually watch the filesystem in tests,
        // so we set the interval to 1 ms.
        this.fileSystemWatcherWorkerDelay = 1;
    }

    getCompileCommandsJsonDir(): string {
        return this.testDir;
    }

    getCallGraphDatabaseDir(): string {
        return this.testDir;
    }
}
