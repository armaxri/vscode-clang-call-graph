export type Location = {
    line: number;
    column: number;
};

export type FuncMentioning = {
    funcName: string;
    funcAstName: string;
    file: string;
    startLoc: Location;
    endLoc: Location;
};

export type FuncCall = {
    callingFuncAstName: string;
    callDetails: FuncMentioning;
};

export type InheritedVirtualFuncDeclaration = {
    baseFuncAstName: string;
    funcDec: FuncMentioning;
};

export type VirtualFuncImplementation = {
    baseFuncAstName: string;
    funcImpl: FuncMentioning;
};

export type VirtualFuncCall = {
    callingFuncAstName: string;
    baseFuncAstName: string;
    callDetails: FuncMentioning;
};

export interface IDatabase {
    registerFuncDeclaration(funcDec: FuncMentioning): void;
    registerFuncImplementation(funcImpl: FuncMentioning): void;
    registerFuncCall(funcCall: FuncCall): void;
    registerVirtualFuncDeclaration(funcDec: FuncMentioning): void;
    registerInheritedVirtualFuncDeclaration(
        funcDec: InheritedVirtualFuncDeclaration
    ): void;
    registerVirtualFuncImplementation(
        funcImpl: VirtualFuncImplementation
    ): void;
    registerVirtualFuncCall(funcCall: VirtualFuncCall): void;
}
