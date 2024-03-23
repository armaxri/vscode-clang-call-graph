import * as vscode from "vscode";
import * as utils from "./utils/vscode_utils";
import { StringReplacer } from "./utils/ConfigStringReplacer";

export class Configuration {
    compileCommandsJsonPath: string = "";
    callGraphDatabasePath: string = "";
    numOfParserThreads: number = 8;

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
}

function assignValue<T>(value: T | undefined, defaultValue: T): T {
    return typeof value === "undefined" ? defaultValue : value;
}
