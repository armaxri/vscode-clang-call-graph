import * as vscode from "vscode";
import * as path from "path";
import * as utils from "./utils";

export class StringReplacer {
    cwd: string = "";
    fileBasenameNoExtensions: string = "";
    fileBasename: string = "";
    fileDirname: string = "";
    fileExtname: string = "";
    file: string = "";
    lineNumber: string = "";
    pathSeparator: string = "";
    relativeFileDirname: string = "";
    relativeFile: string = "";
    selectedText: string = "";
    workspaceFolderBasename: string = "";
    workspaceFolder: string = "";

    constructor() {
        const editor = vscode.window.activeTextEditor;
        this.cwd = `${process.cwd()}`;

        if (editor?.document) {
            this.fileExtname = path.extname(editor.document.fileName);
            this.fileBasenameNoExtensions = path.basename(
                editor.document.fileName,
                this.fileExtname
            );
            this.fileBasename = path.basename(editor.document.fileName);
            this.fileDirname = path.dirname(editor.document.fileName);
            this.file = editor.document.fileName;

            if (editor?.selection) {
                this.selectedText = editor.document.getText(editor.selection);
            }
        }
        this.lineNumber = `${
            editor?.selection ? editor?.selection.active.line + 1 : 0
        }`;
        this.pathSeparator = path.sep;

        const currentWorkspace = utils.getCurrentWorkspace();
        if (currentWorkspace) {
            this.workspaceFolder = currentWorkspace.uri.fsPath;
            this.workspaceFolderBasename = path.basename(this.workspaceFolder);
        }

        this.relativeFile = path.relative(this.workspaceFolder, this.file);
        this.relativeFileDirname = path.relative(
            this.workspaceFolder,
            this.fileDirname
        );

        this.logReplacements();
    }

    public replaceMatches(inputString: string) {
        var resultString = inputString;

        resultString = resultString.replace(/\${cwd}/g, this.cwd);
        resultString = resultString.replace(
            /\${fileBasenameNoExtensions}/g,
            this.fileBasenameNoExtensions
        );
        resultString = resultString.replace(
            /\${fileBasename}/g,
            this.fileBasename
        );
        resultString = resultString.replace(
            /\${fileDirname}/g,
            this.fileDirname
        );
        resultString = resultString.replace(
            /\${fileExtname}/g,
            this.fileExtname
        );
        resultString = resultString.replace(/\${file}/g, this.file);
        resultString = resultString.replace(/\${lineNumber}/g, this.lineNumber);
        resultString = resultString.replace(
            /\${pathSeparator}/g,
            this.pathSeparator
        );
        resultString = resultString.replace(
            /\${relativeFileDirname}/g,
            this.relativeFileDirname
        );
        resultString = resultString.replace(
            /\${relativeFile}/g,
            this.relativeFile
        );
        resultString = resultString.replace(
            /\${selectedText}/g,
            this.selectedText
        );
        resultString = resultString.replace(
            /\${workspaceFolderBasename}/g,
            this.workspaceFolderBasename
        );
        resultString = resultString.replace(
            /\${workspaceFolder}/g,
            this.workspaceFolder
        );

        resultString = resultString.replace(
            /\${env\:([^}]+)}/g,
            function (substring, envName) {
                const envVariable = process.env[envName];
                return envVariable ? envVariable : "";
            }
        );

        return resultString;
    }

    private logReplacements() {
        console.log("---------");
        console.log("Replacement strings:");
        console.log(`cwd:                      ${this.cwd}`);
        console.log(
            `fileBasenameNoExtensions: ${this.fileBasenameNoExtensions}`
        );
        console.log(`fileBasename:             ${this.fileBasename}`);
        console.log(`fileDirname:              ${this.fileDirname}`);
        console.log(`fileExtname:              ${this.fileExtname}`);
        console.log(`file:                     ${this.file}`);
        console.log(`lineNumber:               ${this.lineNumber}`);
        console.log(`pathSeparator:            ${this.pathSeparator}`);
        console.log(`relativeFileDirname:      ${this.relativeFileDirname}`);
        console.log(`relativeFile:             ${this.relativeFile}`);
        console.log(`selectedText:             ${this.selectedText}`);
        console.log(
            `workspaceFolderBasename:  ${this.workspaceFolderBasename}`
        );
        console.log(`workspaceFolder:          ${this.workspaceFolder}`);
        console.log("---------");
    }
}
