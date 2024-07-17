import * as vscode from "vscode";
import * as backend from "../../backend/database/cpp_structure";

export function range2vscodeRange(range: backend.Range): vscode.Range {
    return new vscode.Range(
        range.start.line,
        range.start.column,
        range.end.line,
        range.end.column
    );
}

export function vscodeRange2range(range: vscode.Range): backend.Range {
    return {
        start: { line: range.start.line, column: range.start.character },
        end: { line: range.end.line, column: range.end.character },
    };
}
