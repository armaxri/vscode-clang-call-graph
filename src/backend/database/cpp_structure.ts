export type Location = {
    line: number;
    column: number;
};

export type Range = {
    start: Location;
    end: Location;
};

export function rangeIsEqual(range1: Range, range2: Range): boolean {
    return (
        range1.start.line === range2.start.line &&
        range1.start.column === range2.start.column &&
        range1.end.line === range2.end.line &&
        range1.end.column === range2.end.column
    );
}

export type FuncCreationArgs = {
    funcName: string;
    funcAstName: string;
    qualType: string;
    range: Range;
};

export type VirtualFuncCreationArgs = FuncCreationArgs & {
    baseFuncAstName: string;
};

export type FuncCallCreationArgs = {
    func: FuncDeclaration | FuncImplementation;
    range: Range;
};

export type VirtualFuncCallCreationArgs = {
    func: VirtualFuncDeclaration | VirtualFuncImplementation;
    range: Range;
};

export interface FuncBasics {
    getFuncName(): string;
    getFuncAstName(): string;
    getQualType(): string;
    getRange(): Range;
}

export interface FuncDeclaration extends FuncBasics {
    equals(other: FuncDeclaration): boolean;
}
export interface FuncImplementation extends FuncBasics {
    getFuncCalls(): Array<FuncCall>;
    addFuncCall(funcCall: FuncCallCreationArgs): void;
    getVirtualFuncCalls(): Array<VirtualFuncCall>;
    addVirtualFuncCall(virtualFuncCall: VirtualFuncCallCreationArgs): void;

    equals(other: FuncImplementation): boolean;
}
export interface FuncCall extends FuncBasics {
    equals(other: FuncCall): boolean;
}

export interface VirtualFuncBasics {
    getBaseFuncAstName(): string;
}

export interface VirtualFuncDeclaration
    extends FuncDeclaration,
        VirtualFuncBasics {
    equals(other: VirtualFuncDeclaration): boolean;
}
export interface VirtualFuncImplementation
    extends FuncImplementation,
        VirtualFuncBasics {
    equals(other: VirtualFuncImplementation): boolean;
}
export interface VirtualFuncCall extends FuncCall, VirtualFuncBasics {
    equals(other: VirtualFuncCall): boolean;
}

export interface MainDeclLocation {
    getClasses(): Array<CppClass>;
    getOrAddClass(className: string): CppClass;

    getFuncDecls(): Array<FuncDeclaration>;
    getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration;
    getFuncImpls(): Array<FuncImplementation>;
    getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation;
    getVirtualFuncImpls(): Array<VirtualFuncImplementation>;
    getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation;
}

export interface CppClass extends MainDeclLocation {
    getName(): string;
    getParentClasses(): Array<CppClass>;
    getParentClassNames(): Array<string>;
    addParentClass(parentClass: CppClass): void;

    // Virtual functions can be implemented in a class or file but only declared
    // within a class body.
    getVirtualFuncDecls(): Array<VirtualFuncDeclaration>;
    getOrAddVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncDeclaration;

    findBaseFunction(
        funcName: string,
        qualType: string
    ): VirtualFuncDeclaration | undefined;

    equals(other: CppClass): boolean;
}

export interface CppFile extends MainDeclLocation {
    getName(): string;

    getLastAnalyzed(): number;
    justAnalyzed(): void;

    equals(other: CppFile): boolean;
}

export interface HppFile extends CppFile {
    getReferencedFromCppFiles(): Array<string>;
    addReferencedFromCppFile(fileName: string): void;

    equals(other: HppFile): boolean;
}
