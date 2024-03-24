import * as vscode from "vscode";
import { Configuration } from "./Configuration";
import { Database } from "./Database";
import { ClangCallGraphParser } from "../backend/ClangCallGraphParser";
import { CallHierarchyProvider } from "./CallHierarchyProvider";

let callGraphDatabase: Database;
let callGraphParser: ClangCallGraphParser;

export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(
        "Congratulations, your extension 'clang-call-graph' is now active!"
    );

    let config = new Configuration();
    callGraphDatabase = new Database(config);
    callGraphParser = new ClangCallGraphParser(config, callGraphDatabase);

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "clang-call-graph.startCallGraphParser",
            () => {
                if (callGraphParser.running) {
                    console.log("Stop the clang call graph parser.");
                    callGraphParser.stopParser();
                }
                console.log("Start the clang call graph parser.");
                let config = new Configuration();
                callGraphDatabase.resetDatabase(config);
                callGraphParser.startParser(config);
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "clang-call-graph.stopCallGraphParser",
            () => {
                if (callGraphParser.running) {
                    console.log("Stop the clang call graph parser.");
                    callGraphParser.stopParser();
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
        callGraphParser.stopParser();
    }
}
