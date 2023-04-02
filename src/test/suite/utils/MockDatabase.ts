import * as iDb from "../../../IDatabase";

export class MockDatabase implements iDb.IDatabase {
    public funcDeclarations: Array<iDb.FuncMentioning> =
        new Array<iDb.FuncMentioning>();
    public funcImplementations: Array<iDb.FuncMentioning> =
        new Array<iDb.FuncMentioning>();
    public funcCalls: Array<iDb.FuncCall> = new Array<iDb.FuncCall>();
    public virtualFuncDeclaration: Array<iDb.FuncMentioning> =
        new Array<iDb.FuncMentioning>();
    public inheritedVirtualFuncDeclaration: Array<iDb.InheritedVirtualFuncDeclaration> =
        new Array<iDb.InheritedVirtualFuncDeclaration>();
    public virtualFuncImplementation: Array<iDb.VirtualFuncImplementation> =
        new Array<iDb.VirtualFuncImplementation>();
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
    registerVirtualFuncDeclaration(funcDec: iDb.FuncMentioning): void {
        this.virtualFuncDeclaration.push(funcDec);
    }
    registerInheritedVirtualFuncDeclaration(
        funcDec: iDb.InheritedVirtualFuncDeclaration
    ): void {
        this.inheritedVirtualFuncDeclaration.push(funcDec);
    }
    registerVirtualFuncImplementation(
        funcImpl: iDb.VirtualFuncImplementation
    ): void {
        this.virtualFuncImplementation.push(funcImpl);
    }
    registerVirtualFuncCall(funcCall: iDb.VirtualFuncCall): void {
        this.virtualFuncCall.push(funcCall);
    }
}
