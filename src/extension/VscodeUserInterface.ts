import * as vscode from "vscode";
import { UserInterface } from "../backend/UserInterface";

export class VscodeUserInterface implements UserInterface {
    displayError(message: string): void {
        vscode.window.showErrorMessage(message);
    }
}
