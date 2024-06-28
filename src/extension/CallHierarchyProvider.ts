import * as vscode from "vscode";
import { BaseRequestHandler } from "../backend/functionSearch/BaseRequestHandler";
import { CallHierarchyItem } from "./CallHierarchyItem";
import { VscodeCancellationToken } from "./VscodeCancellationToken";

export class CallHierarchyProvider implements vscode.CallHierarchyProvider {
    private requestHandler: BaseRequestHandler;

    constructor(requestHandler: BaseRequestHandler) {
        this.requestHandler = requestHandler;
    }

    prepareCallHierarchy(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<
        vscode.CallHierarchyItem | vscode.CallHierarchyItem[]
    > {
        const callHierarchyItems: CallHierarchyItem[] = [];

        const treeItem = this.requestHandler.getTreeItem(
            document.fileName,
            {
                line: position.line,
                column: position.character,
            },
            new VscodeCancellationToken(token)
        );

        if (treeItem) {
            callHierarchyItems.push(new CallHierarchyItem(treeItem));
        }

        return callHierarchyItems;
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
