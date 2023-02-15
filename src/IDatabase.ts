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

export interface IDatabase {
    registerFuncDeclaration(funcDec: FuncMentioning): void;
    registerFuncImplementation(funcImpl: FuncMentioning): void;
    registerFuncCall(funcCall: FuncCall): void;
}
