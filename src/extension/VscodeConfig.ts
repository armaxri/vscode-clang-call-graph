import * as vscode from "vscode";
import * as utils from "./utils/vscode_utils";
import { StringReplacer } from "./utils/ConfigStringReplacer";
import { Config, DatabaseType } from "../backend/Config";
import { Database } from "../backend/database/Database";
import { PathUtils } from "../backend/utils/PathUtils";

export class VscodeConfig extends Config {
    private database: Database | undefined = undefined;

    private getExtensionConfig(): vscode.WorkspaceConfiguration {
        const correspondingWorkspace = utils.getCurrentWorkspace();
        return vscode.workspace.getConfiguration(
            "clangCallGraph",
            correspondingWorkspace
        );
    }

    getCompileCommandsJsonDir(): string {
        const config = this.getExtensionConfig();
        const compileCommandsJsonDir = assignPath(
            config.get<string>("compileCommandsJsonDir"),
            ""
        );

        return compileCommandsJsonDir;
    }

    getNumOfParserThreads(): number {
        const config = this.getExtensionConfig();
        const numOfParserThreads = assignValue<number>(
            config.get<number>("numOfParserThreads"),
            super.getNumOfParserThreads()
        );

        return numOfParserThreads;
    }

    getCallGraphDatabaseDir(): string {
        const config = this.getExtensionConfig();
        const callGraphDatabaseDir = assignPath(
            config.get<string>("callGraphDatabaseDir"),
            ""
        );

        return callGraphDatabaseDir;
    }

    getSelectedDatabaseType(): DatabaseType {
        // TODO(#12): Implement this.
        return DatabaseType.lowdb;
    }

    getCallGraphDatabasePath(): string {
        // TODO(#12): Remove this method.
        const config = this.getExtensionConfig();
        const callGraphDatabasePath = assignPath(
            config.get<string>("callGraphDatabasePath"),
            "clang_call_graph.sqlite3"
        );

        return callGraphDatabasePath;
    }

    useDatabaseCaching(): boolean {
        // Currently not a real configuration option.
        // TODO(#13): Do some testing if this is a good idea.
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
