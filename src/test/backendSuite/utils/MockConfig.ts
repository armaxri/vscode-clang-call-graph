import { IConfig } from "../../../backend/IConfig";
import { IDatabase } from "../../../backend/IDatabase";
import { PathUtils } from "../../../backend/utils/PathUtils";
import { MockDatabase } from "./MockDatabase";
import { adjustTsToJsPath } from "./path_helper";

export class MockConfig implements IConfig {
    private testDir: string = "";

    public loggedErrors: Array<string> = new Array<string>();

    constructor(testDir: string) {
        this.testDir = testDir;
    }

    private getFilePathInTestDir(fileName: string): string {
        const testDirPath = new PathUtils(this.testDir);
        return adjustTsToJsPath(testDirPath.joinPath(fileName).pathString());
    }

    getCompileCommandsJsonPath(): string {
        return this.getFilePathInTestDir("compile_commands.json");
    }

    getCallGraphDatabasePath(): string {
        return this.getFilePathInTestDir("call_graph.db");
    }

    getNumOfParserThreads(): number {
        return 1;
    }

    getDatabase(): IDatabase {
        return new MockDatabase();
    }

    displayError(message: string): void {
        console.error(`displayError: "${message}"`);
        this.loggedErrors.push(message);
    }
}
