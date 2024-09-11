import * as vscode from "vscode";
import { UserInterface } from "../backend/UserInterface";

export class VscodeUserInterface extends UserInterface {
    logError(message: string): void {
        vscode.window.showErrorMessage(message);
    }
}
