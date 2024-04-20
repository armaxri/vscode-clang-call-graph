import { Config, DatabaseType } from "../../../backend/Config";
import { PathUtils } from "../../../backend/utils/PathUtils";
import { adjustTsToJsPath } from "./path_helper";

export class MockConfig extends Config {
    private testDir: string = "";

    public numOfParserThreads: number = 1;

    constructor(testDir: string) {
        super();
        this.testDir = adjustTsToJsPath(testDir);
    }

    getCompileCommandsJsonDir(): string {
        return this.testDir;
    }

    getNumOfParserThreads(): number {
        return 1;
    }

    getSelectedDatabaseType(): DatabaseType {
        // Test should use lowdb database for simple comparison and the data should not exceed the limit of lowdb.
        return DatabaseType.lowdb;
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
