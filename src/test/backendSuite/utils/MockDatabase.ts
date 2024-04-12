import * as iDb from "../../../backend/IDatabase";

export class MockDatabase implements iDb.IDatabase {
    public funcDeclarations: Array<iDb.FuncMentioning> =
        new Array<iDb.FuncMentioning>();
    public funcImplementations: Array<iDb.FuncMentioning> =
        new Array<iDb.FuncMentioning>();
    public funcCalls: Array<iDb.FuncCall> = new Array<iDb.FuncCall>();
    public virtualFuncDeclaration: Array<iDb.VirtualFuncMentioning> =
        new Array<iDb.VirtualFuncMentioning>();
    public virtualFuncImplementation: Array<iDb.VirtualFuncMentioning> =
        new Array<iDb.VirtualFuncMentioning>();
    public virtualFuncCall: Array<iDb.VirtualFuncCall> =
        new Array<iDb.VirtualFuncCall>();

    registerFuncDeclaration(funcDec: iDb.FuncMentioning): void {
        this.funcDeclarations.push(funcDec);
    }

    registerFuncImplementation(funcImpl: iDb.FuncMentioning): void {
        this.funcImplementations.push(funcImpl);
    }

    registerFuncCall(funcCall: iDb.FuncCall): void {
        this.funcCalls.push(funcCall);
    }

    registerVirtualFuncDeclaration(funcDec: iDb.VirtualFuncMentioning): void {
        this.virtualFuncDeclaration.push(funcDec);
    }

    registerVirtualFuncImplementation(
        funcImpl: iDb.VirtualFuncMentioning
    ): void {
        this.virtualFuncImplementation.push(funcImpl);
    }

    registerVirtualFuncCall(funcCall: iDb.VirtualFuncCall): void {
        this.virtualFuncCall.push(funcCall);
    }

    resetDatabase(): void {
        this.funcDeclarations = new Array<iDb.FuncMentioning>();
        this.funcImplementations = new Array<iDb.FuncMentioning>();
        this.funcCalls = new Array<iDb.FuncCall>();
        this.virtualFuncDeclaration = new Array<iDb.VirtualFuncMentioning>();
        this.virtualFuncImplementation = new Array<iDb.VirtualFuncMentioning>();
        this.virtualFuncCall = new Array<iDb.VirtualFuncCall>();
    }
}
