import * as vscode from "vscode";

export function getCurrentWorkspace() {
    if (vscode.workspace.workspaceFolders?.length === 1) {
        console.log(
            `Only one workspace (${vscode.workspace.workspaceFolders[0].uri.fsPath}) present. Using it directly.`
        );
        return vscode.workspace.workspaceFolders[0];
    }
    console.log(
        "Multi root workspace or non in selection. Using the current file to determine the workspace."
    );
    const currentFileUri = vscode.window.activeTextEditor?.document.uri;
    console.log(`Using file URI "${currentFileUri}" to determine workspace.`);
    const correspondingWorkspace = currentFileUri
        ? vscode.workspace.getWorkspaceFolder(currentFileUri)
        : null;
    console.log(`Using workspace "${correspondingWorkspace?.name}".`);

    return correspondingWorkspace;
}
