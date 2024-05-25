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
        super(databaseType, true);

        this.testDir = adjustTsToJsPath(testDir);
        this.databaseType = databaseType;
        this.lowdbDatabaseName =
            lowdbDatabaseName ?? super.getLowdbDatabaseName();
        this.compileCommandsJsonName =
            compileCommandsJsonName ?? super.getCompileCommandsJsonName();

        this.numOfParserThreads = 1;
    }

    getCompileCommandsJsonDir(): string {
        return this.testDir;
    }

    getSelectedDatabaseType(): DatabaseType {
        return this.databaseType;
    }

    getCallGraphDatabaseDir(): string {
        return this.testDir;
    }

    useDatabaseCaching(): boolean {
        return false;
    }

    runVerbose(): boolean {
        return true;
    }
}
