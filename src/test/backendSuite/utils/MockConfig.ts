import { IConfig } from "../../../backend/IConfig";
import { PathUtils } from "../../../backend/utils/PathUtils";
import { adjustTsToJsPath } from "./path_helper";

export class MockConfig implements IConfig {
    private testDir: string = "";

    public compileCommandsJsonPath: string = "compile_commands.json";
    public callGraphDatabasePath: string = "call_graph.db";
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

    runVerbose(): boolean {
        return true;
    }
}
