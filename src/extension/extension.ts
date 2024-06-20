import * as vscode from "vscode";
import { VscodeConfig } from "./VscodeConfig";
import { VscodeUserInterface } from "./VscodeUserInterface";
import { ClangFilesystemWatcher } from "../backend/ClangFilesystemWatcher";
import { CallHierarchyProvider } from "./CallHierarchyProvider";
import { ClangAstWalkerFactory } from "../backend/astWalker/clang/ClangAstWalkerFactory";
import { Database } from "../backend/database/Database";
import { createDatabase } from "../backend/database/helper/database_factory";

let callGraphDatabase: Database;
let callGraphParser: ClangFilesystemWatcher;

export async function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(
        "Congratulations, your extension 'clang-call-graph' is now active!"
    );

    let config = new VscodeConfig();
    let database = createDatabase(config);
    callGraphParser = new ClangFilesystemWatcher(
        config,
        new VscodeUserInterface(),
        new ClangAstWalkerFactory(),
        database
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "clang-call-graph.startCallGraphParser",
            () => {
                if (callGraphParser.isRunning()) {
                    console.log("Stop the clang call graph parser.");
                    callGraphParser.stopWatching();
                }
                console.log("Start the clang call graph parser.");
                callGraphDatabase.resetDatabase();
                callGraphParser.startWatching();
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "clang-call-graph.stopCallGraphParser",
            () => {
                if (callGraphParser.isRunning()) {
                    console.log("Stop the clang call graph parser.");
                    callGraphParser.stopWatching();
                }
            }
        )
    );

    //    const disposableCallHierarchyProvider =
    //        vscode.languages.registerCallHierarchyProvider(
    //            ["c", "cpp"],
    //            new ClangCallHierarchyProvider()
    //        );
    //    context.subscriptions.push(disposableCallHierarchyProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {
    if (callGraphParser) {
        callGraphParser.stopWatching();
    }
}
