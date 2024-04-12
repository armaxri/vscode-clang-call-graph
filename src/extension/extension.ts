import * as vscode from "vscode";
import { Configuration } from "./Configuration";
import { Database } from "./Database";
import { UserInterface } from "./UserInterface";
import { ClangFilesystemWatcher } from "../backend/ClangFilesystemWatcher";
import { CallHierarchyProvider } from "./CallHierarchyProvider";
import { ClangAstWalkerFactory } from "../backend/ClangAstWalkerFactory";

let callGraphDatabase: Database;
let callGraphParser: ClangFilesystemWatcher;

export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(
        "Congratulations, your extension 'clang-call-graph' is now active!"
    );

    let config = new Configuration();
    callGraphParser = new ClangFilesystemWatcher(
        config,
        new UserInterface(),
        new ClangAstWalkerFactory()
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
                let config = new Configuration();
                callGraphDatabase.resetDatabase(config);
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
