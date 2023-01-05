import * as vscode from "vscode";

export class ClangCallHierarchyProvider
    implements vscode.CallHierarchyProvider
{
    prepareCallHierarchy(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<
        vscode.CallHierarchyItem | vscode.CallHierarchyItem[]
    > {
        throw new Error("Method not implemented.");
    }

    provideCallHierarchyIncomingCalls(
        item: vscode.CallHierarchyItem,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CallHierarchyIncomingCall[]> {
        throw new Error("Method not implemented.");
    }

    provideCallHierarchyOutgoingCalls(
        item: vscode.CallHierarchyItem,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CallHierarchyOutgoingCall[]> {
        throw new Error("Method not implemented.");
    }
}
