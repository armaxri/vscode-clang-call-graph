import * as vscode from "vscode";
import * as utils from "./utils/vscode_utils";
import { StringReplacer } from "./utils/ConfigStringReplacer";
import { Config } from "../backend/Config";
import { IDatabase } from "../backend/database/IDatabase";
import { PathUtils } from "../backend/utils/PathUtils";

export class VscodeConfig implements Config {
    private database: IDatabase | undefined = undefined;

    private getExtensionConfig(): vscode.WorkspaceConfiguration {
        const correspondingWorkspace = utils.getCurrentWorkspace();
        return vscode.workspace.getConfiguration(
            "clangCallGraph",
            correspondingWorkspace
        );
    }

    getCompileCommandsJsonPath(): string {
        const config = this.getExtensionConfig();
        const compileCommandsJsonPath = assignPath(
            config.get<string>("compileCommandsJsonDir"),
            "compile_commands.json"
        );

        return compileCommandsJsonPath;
    }

    getCallGraphDatabasePath(): string {
        const config = this.getExtensionConfig();
        const callGraphDatabasePath = assignPath(
            config.get<string>("callGraphDatabasePath"),
            "clang_call_graph.sqlite3"
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

    useDatabaseCaching(): boolean {
        // Currently not a real configuration option.
        // TODO: Do some testing if this is a good idea.
        // May use a fixed strategy or make it configurable.
        return true;
    }

    runVerbose(): boolean {
        const config = this.getExtensionConfig();
        const runVerbose = assignValue<boolean>(
            config.get<boolean>("runVerbose"),
            false
        );
        return runVerbose;
    }
}

function assignPath(value: string | undefined, defaultValue: string): string {
    const stringReplacer = new StringReplacer();
    const workspaceDir = utils.getCurrentWorkspace();
    const actualDefaultPath =
        typeof workspaceDir === "undefined" || workspaceDir === null
            ? defaultValue
            : new PathUtils(workspaceDir.name, defaultValue).pathString();

    return typeof value === "undefined"
        ? actualDefaultPath
        : stringReplacer.replaceMatches(value);
}

function assignValue<T>(value: T | undefined, defaultValue: T): T {
    return typeof value === "undefined" ? defaultValue : value;
}
