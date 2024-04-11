import * as vscode from "vscode";
import { IUserInterface } from "../backend/IUserInterface";

export class MockUserInterface implements IUserInterface {
    public loggedErrors: Array<string> = new Array<string>();

    displayError(message: string): void {
        vscode.window.showErrorMessage(message);
    }
}
