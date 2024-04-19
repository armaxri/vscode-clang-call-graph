import { Config } from "../../../backend/Config";
import { PathUtils } from "../../../backend/utils/PathUtils";
import { adjustTsToJsPath } from "./path_helper";

export class MockConfig implements Config {
    private testDir: string = "";

    public compileCommandsJsonPath: string = "compile_commands.json";
    public callGraphDatabasePath: string = "clang_call_graph.sqlite3";
    public numOfParserThreads: number = 1;

    constructor(testDir: string) {
        this.testDir = testDir;
    }

    private getFilePathInTestDir(fileName: string): string {
        const testDirPath = new PathUtils(this.testDir);
        return adjustTsToJsPath(testDirPath.joinPath(fileName).pathString());
    }

    getCompileCommandsJsonPath(): string {
        return this.getFilePathInTestDir(this.compileCommandsJsonPath);
    }

    getCallGraphDatabasePath(): string {
        return this.getFilePathInTestDir(this.callGraphDatabasePath);
    }

    getNumOfParserThreads(): number {
        return this.numOfParserThreads;
    }

    useDatabaseCaching(): boolean {
        return false;
    }

    runVerbose(): boolean {
        return true;
    }
}
