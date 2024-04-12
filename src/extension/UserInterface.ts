import * as vscode from "vscode";
import { IUserInterface } from "../backend/IUserInterface";

export class UserInterface implements IUserInterface {
    displayError(message: string): void {
        vscode.window.showErrorMessage(message);
    }
}
