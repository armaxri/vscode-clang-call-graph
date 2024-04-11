import * as vscode from "vscode";
import * as utils from "./utils/vscode_utils";
import { StringReplacer } from "./utils/ConfigStringReplacer";
import { IConfig } from "../backend/IConfig";
import { IDatabase } from "../backend/IDatabase";
import { MockDatabase } from "../test/backendSuite/utils/MockDatabase";

export class Configuration implements IConfig {
    private compileCommandsJsonPath: string = "";
    private callGraphDatabasePath: string = "";
    private numOfParserThreads: number = 8;

    constructor() {
        const stringReplacer = new StringReplacer();

        // Start with a simple single workspace.
        const correspondingWorkspace = utils.getCurrentWorkspace();
        const config = vscode.workspace.getConfiguration(
            "clangCallGraph",
            correspondingWorkspace
        );
        this.compileCommandsJsonPath = stringReplacer.replaceMatches(
            assignValue<string>(
                config.get<string>("compileCommandsJsonDir"),
                this.compileCommandsJsonPath
            )
        );
        this.callGraphDatabasePath = stringReplacer.replaceMatches(
            assignValue<string>(
                config.get<string>("callGraphDatabasePath"),
                this.callGraphDatabasePath
            )
        );
        this.numOfParserThreads = assignValue<number>(
            config.get<number>("numOfParserThreads"),
            this.numOfParserThreads
        );
    }

    getDatabase(): IDatabase {
        // TODO: This is just a temporary solution!
        return new MockDatabase();
    }

    getCompileCommandsJsonPath(): string {
        return this.compileCommandsJsonPath;
    }

    getCallGraphDatabasePath(): string {
        return this.callGraphDatabasePath;
    }

    getNumOfParserThreads(): number {
        return this.numOfParserThreads;
    }
}

function assignValue<T>(value: T | undefined, defaultValue: T): T {
    return typeof value === "undefined" ? defaultValue : value;
}
