export type Location = {
    line: number;
    column: number;
};

export type Range = {
    start: Location;
    end: Location;
};

export interface FuncBasics {
    getFuncName(): string;
    getFuncAstName(): string;
    getRange(): Range;
}

export interface FuncDeclaration extends FuncBasics {}
export interface FuncImplementation extends FuncBasics {
    getFuncCalls(): Array<FuncCall>;
    getVirtualFuncCalls(): Array<VirtualFuncCall>;
}
export interface FuncCall extends FuncBasics {}

export interface VirtualFuncDeclaration extends FuncDeclaration {
    getBaseFuncAstName(): string;
}
export interface VirtualFuncImplementation extends FuncImplementation {
    getBaseFuncAstName(): string;
}
export interface VirtualFuncCall extends FuncCall {
    getBaseFuncAstName(): string;
}

export interface CppClass {
    getName(): string;
    getParentClasses(): Array<CppClass>;

    getClasses(): Array<CppClass>;
    getOrAddClass(className: string): CppClass;

    getFuncDecls(): Array<FuncDeclaration>;
    getFuncImpls(): Array<FuncImplementation>;
    getVirtualFuncDecls(): Array<VirtualFuncDeclaration>;
    getVirtualFuncImpls(): Array<VirtualFuncImplementation>;
}

export interface CppFile {
    getName(): string;

    getLastAnalyzed(): number;
    justAnalyzed(): void;

    getClasses(): Array<CppClass>;
    getOrAddClass(className: string): CppClass;
    getFuncDecls(): Array<FuncDeclaration>;
    getFuncImpls(): Array<FuncImplementation>;
    getVirtualFuncImpls(): Array<VirtualFuncImplementation>;
}
export interface HppFile extends CppFile {
    getReferencedFromCppFiles(): Array<string>;
    addReferencedFromCppFile(fileName: string): void;
}
