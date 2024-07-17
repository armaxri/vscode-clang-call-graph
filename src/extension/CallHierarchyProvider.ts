import * as vscode from "vscode";
import { BaseRequestHandler } from "../backend/functionSearch/BaseRequestHandler";
import { CallHierarchyItem } from "./CallHierarchyItem";
import { VscodeCancellationToken } from "./VscodeCancellationToken";
import { range2vscodeRange } from "./utils/location_conversion";

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
        const incomingCalls: vscode.CallHierarchyIncomingCall[] = [];

        (item as CallHierarchyItem)
            .getTreeItem()
            .getIncomingCalls(new VscodeCancellationToken(token))
            .forEach((treeItem) => {
                incomingCalls.push({
                    from: new CallHierarchyItem(treeItem),
                    fromRanges: [
                        range2vscodeRange(treeItem.getFunc().getRange()),
                    ],
                });
            });

        return incomingCalls;
    }

    provideCallHierarchyOutgoingCalls(
        item: vscode.CallHierarchyItem,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CallHierarchyOutgoingCall[]> {
        const outgoingCalls: vscode.CallHierarchyOutgoingCall[] = [];

        (item as CallHierarchyItem)
            .getTreeItem()
            .getOutgoingCalls(new VscodeCancellationToken(token))
            .forEach((treeItem) => {
                outgoingCalls.push({
                    to: new CallHierarchyItem(treeItem),
                    fromRanges: [
                        range2vscodeRange(treeItem.getFunc().getRange()),
                    ],
                });
            });

        return outgoingCalls;
    }
}
