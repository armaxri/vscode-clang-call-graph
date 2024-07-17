import * as vscode from "vscode";
import { CancellationToken } from "../backend/functionSearch/CancellationToken";

export class VscodeCancellationToken extends CancellationToken {
    private token: vscode.CancellationToken;

    constructor(token: vscode.CancellationToken) {
        super();

        this.token = token;
    }

    public isCancelled(): boolean {
        return this.token.isCancellationRequested || super.isCancelled();
    }
}
