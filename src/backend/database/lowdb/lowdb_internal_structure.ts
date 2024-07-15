import { Range } from "../cpp_structure";

export const CURRENT_DATABASE_VERSION = 1;

export type LowdbInternalFuncMentioning = {
    funcName: string;
    funcAstName: string;
    qualType: string;
    range: Range;
};

export type LowdbInternalVirtualFuncMentioning = {
    funcName: string;
    funcAstName: string;
    baseFuncAstName: string;
    qualType: string;
    range: Range;
};

export type LowdbInternalFuncImplementation = {
    funcName: string;
    funcAstName: string;
    qualType: string;
    range: Range;
    funcCalls: LowdbInternalFuncMentioning[];
    virtualFuncCalls: LowdbInternalVirtualFuncMentioning[];
};

export type LowdbInternalVirtualFuncImplementation = {
    funcName: string;
    funcAstName: string;
    baseFuncAstName: string;
    qualType: string;
    range: Range;
    funcCalls: LowdbInternalFuncMentioning[];
    virtualFuncCalls: LowdbInternalVirtualFuncMentioning[];
};

export type LowdbInternalCppClass = {
    name: string;
    parentClasses: string[];
    classes: LowdbInternalCppClass[];
    funcDecls: LowdbInternalFuncMentioning[];
    funcImpls: LowdbInternalFuncImplementation[];
    virtualFuncDecls: LowdbInternalVirtualFuncMentioning[];
    virtualFuncImpls: LowdbInternalVirtualFuncImplementation[];
};

export type LowdbInternalCppFile = {
    name: string;
    lastAnalyzed: number;
    classes: LowdbInternalCppClass[];
    funcDecls: LowdbInternalFuncMentioning[];
    funcImpls: LowdbInternalFuncImplementation[];
    virtualFuncImpls: LowdbInternalVirtualFuncImplementation[];
};

export type LowdbInternalHppFile = {
    name: string;
    lastAnalyzed: number;
    classes: LowdbInternalCppClass[];
    funcDecls: LowdbInternalFuncMentioning[];
    funcImpls: LowdbInternalFuncImplementation[];
    virtualFuncImpls: LowdbInternalVirtualFuncImplementation[];
    referencedFromFiles: string[];
};

export type LowdbInternalDatabase = {
    databaseVersion: number;
    cppFiles: LowdbInternalCppFile[];
    hppFiles: LowdbInternalHppFile[];
};

export function createEmptyLowdbInternalDatabase(): LowdbInternalDatabase {
    return {
        databaseVersion: CURRENT_DATABASE_VERSION,
        cppFiles: [],
        hppFiles: [],
    };
}
