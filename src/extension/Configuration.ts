import * as vscode from "vscode";
import * as utils from "./utils/vscode_utils";
import { StringReplacer } from "./utils/ConfigStringReplacer";
import { IConfig } from "../backend/IConfig";
import { IDatabase } from "../backend/IDatabase";
import { MockDatabase } from "../test/backendSuite/utils/MockDatabase";

export class Configuration implements IConfig {
    private database: IDatabase | undefined = undefined;

    private getExtensionConfig(): vscode.WorkspaceConfiguration {
        const correspondingWorkspace = utils.getCurrentWorkspace();
        return vscode.workspace.getConfiguration(
            "clangCallGraph",
            correspondingWorkspace
        );
    }

    getDatabase(): IDatabase {
        if (this.database === undefined) {
            // TODO: This is just a temporary solution!
            this.database = new MockDatabase();
        }
        return this.database;
    }

    getCompileCommandsJsonPath(): string {
        const stringReplacer = new StringReplacer();
        const config = this.getExtensionConfig();
        const compileCommandsJsonPath = stringReplacer.replaceMatches(
            assignValue<string>(
                config.get<string>("compileCommandsJsonDir"),
                ""
            )
        );

        return compileCommandsJsonPath;
    }

    getCallGraphDatabasePath(): string {
        const stringReplacer = new StringReplacer();
        const config = this.getExtensionConfig();
        const callGraphDatabasePath = stringReplacer.replaceMatches(
            assignValue<string>(config.get<string>("callGraphDatabasePath"), "")
        );
        return callGraphDatabasePath;
    }

    getNumOfParserThreads(): number {
        const config = this.getExtensionConfig();
        const numOfParserThreads = assignValue<number>(
            config.get<number>("numOfParserThreads"),
            8
        );

        return numOfParserThreads;
    }
}

function assignValue<T>(value: T | undefined, defaultValue: T): T {
    return typeof value === "undefined" ? defaultValue : value;
}
