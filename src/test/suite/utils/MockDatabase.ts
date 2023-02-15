import * as iDb from "../../../IDatabase";

export function orderArrayorderArraysByLineAndColumnsByLine(
    input: Array<iDb.FuncMentioning>
): Array<iDb.FuncMentioning> {
    return input.sort((element0, element1) => {
        return element0.funcAstName > element1.funcAstName
            ? -1
            : element0.funcAstName < element1.funcAstName
            ? 1
            : element0.startLoc.line !== element1.startLoc.line
            ? element0.startLoc.line - element1.startLoc.line
            : element0.startLoc.column - element1.startLoc.column;
    });
}

export function orderArraysByLineAndColumn(
    input: Array<iDb.FuncCall>
): Array<iDb.FuncCall> {
    return input.sort((element0, element1) => {
        return element0.callDetails.funcAstName >
            element1.callDetails.funcAstName
            ? -1
            : element0.callDetails.funcAstName <
              element1.callDetails.funcAstName
            ? 1
            : element0.callDetails.startLoc.line !==
              element1.callDetails.startLoc.line
            ? element0.callDetails.startLoc.line -
              element1.callDetails.startLoc.line
            : element0.callDetails.startLoc.column -
              element1.callDetails.startLoc.column;
    });
}

export class MockDatabase implements iDb.IDatabase {
    public funcDeclarations: Array<iDb.FuncMentioning> =
        new Array<iDb.FuncMentioning>();
    public funcImplementations: Array<iDb.FuncMentioning> =
        new Array<iDb.FuncMentioning>();
    public funcCalls: Array<iDb.FuncCall> = new Array<iDb.FuncCall>();

    registerFuncDeclaration(funcDec: iDb.FuncMentioning): void {
        this.funcDeclarations.push(funcDec);
    }
    registerFuncImplementation(funcImpl: iDb.FuncMentioning): void {
        this.funcImplementations.push(funcImpl);
    }
    registerFuncCall(funcCall: iDb.FuncCall): void {
        this.funcCalls.push(funcCall);
    }
}
