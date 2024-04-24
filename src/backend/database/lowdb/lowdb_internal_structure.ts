import { Range } from "../cpp_structure";

export const CURRENT_DATABASE_VERSION = 1;

export type LowdbInternalFuncMentioning = {
    funcName: string;
    funcAstName: string;
    range: Range;
};

export type LowdbInternalVirtualFuncMentioning = {
    funcName: string;
    funcAstName: string;
    baseFuncAstName: string;
    range: Range;
};

export type LowdbInternalFuncImplementation = {
    funcName: string;
    funcAstName: string;
    range: Range;
    funcCalls: Array<LowdbInternalFuncMentioning>;
    virtualFuncCalls: Array<LowdbInternalVirtualFuncMentioning>;
};

export type LowdbInternalVirtualFuncImplementation = {
    funcName: string;
    funcAstName: string;
    baseFuncAstName: string;
    range: Range;
    funcCalls: Array<LowdbInternalFuncMentioning>;
    virtualFuncCalls: Array<LowdbInternalVirtualFuncMentioning>;
};

export type LowdbInternalCppClass = {
    name: string;
    parentClasses: Array<LowdbInternalCppClass>;
    classes: Array<LowdbInternalCppClass>;
    funcDecls: Array<LowdbInternalFuncMentioning>;
    funcImpls: Array<LowdbInternalFuncImplementation>;
    virtualFuncDecls: Array<LowdbInternalVirtualFuncMentioning>;
    virtualFuncImpls: Array<LowdbInternalVirtualFuncImplementation>;
};

export type LowdbInternalCppFile = {
    name: string;
    lastAnalyzed: number;
    classes: Array<LowdbInternalCppClass>;
    funcDecls: Array<LowdbInternalFuncMentioning>;
    funcImpls: Array<LowdbInternalFuncImplementation>;
    virtualFuncImpls: Array<LowdbInternalVirtualFuncImplementation>;
};

export type LowdbInternalHppFile = {
    name: string;
    lastAnalyzed: number;
    classes: Array<LowdbInternalCppClass>;
    funcDecls: Array<LowdbInternalFuncMentioning>;
    funcImpls: Array<LowdbInternalFuncImplementation>;
    virtualFuncImpls: Array<LowdbInternalVirtualFuncImplementation>;
    referencedFromCppFiles: Array<string>;
};

export type LowdbInternalDatabase = {
    databaseVersion: number;
    cppFiles: Array<LowdbInternalCppFile>;
    hppFiles: Array<LowdbInternalHppFile>;
};

export function createEmptyLowdbInternalDatabase(): LowdbInternalDatabase {
    return {
        databaseVersion: CURRENT_DATABASE_VERSION,
        cppFiles: [],
        hppFiles: [],
    };
}
