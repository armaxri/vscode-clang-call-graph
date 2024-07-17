import * as vscode from "vscode";
import { TreeItem } from "../backend/functionSearch/TreeItem";
import { range2vscodeRange } from "./utils/location_conversion";

export class CallHierarchyItem extends vscode.CallHierarchyItem {
    private treeItem: TreeItem;

    constructor(treeItem: TreeItem) {
        super(
            treeItem.isMethod()
                ? vscode.SymbolKind.Method
                : vscode.SymbolKind.Function,
            treeItem.getFunc().getFuncName(),
            // TODO: Evaluate this.
            "",
            vscode.Uri.file(treeItem.getFile().getName()),
            range2vscodeRange(treeItem.getFunc().getRange()),
            range2vscodeRange(treeItem.getFunc().getRange())
        );

        this.treeItem = treeItem;
    }

    getTreeItem(): TreeItem {
        return this.treeItem;
    }
}
