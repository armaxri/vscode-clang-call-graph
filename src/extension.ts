import * as vscode from "vscode";
import { ClangCallGraphConfiguration } from "./ClangCallGraphConfiguration";
import { ClangCallGraphParser } from "./ClangCallGraphParser";
import { ClangCallHierarchyProvider } from "./ClangCallHierarchyProvider";

let clangCallGraphParser: ClangCallGraphParser;

export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log(
        "Congratulations, your extension 'clang-call-graph' is now active!"
    );

    clangCallGraphParser = new ClangCallGraphParser(
        new ClangCallGraphConfiguration()
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "clang-call-graph.startCallGraphParser",
            () => {
                if (clangCallGraphParser.running) {
                    console.log("Stop the clang call graph parser.");
                    clangCallGraphParser.stopParser();
                }
                console.log("Start the clang call graph parser.");
                clangCallGraphParser.startParser(
                    new ClangCallGraphConfiguration()
                );
            }
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(
            "clang-call-graph.stopCallGraphParser",
            () => {
                if (clangCallGraphParser.running) {
                    console.log("Stop the clang call graph parser.");
                    clangCallGraphParser.stopParser();
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
    if (clangCallGraphParser) {
        clangCallGraphParser.stopParser();
    }
}
