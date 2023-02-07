export type FuncMentioning = {
    funcName: string;
    funcAstName: string;
    file: string;
    line: number;
    columnStart: number;
    columnEnd: number;
};

export type FuncCall = {
    callingFuncAstName: string;
    callDetails: FuncMentioning;
};

export interface IDatabase {
    registerFuncDeclaration(funcDec: FuncMentioning): void;
    registerFuncImplementation(funcImpl: FuncMentioning): void;
    registerFuncCall(funcCall: FuncCall): void;
}
