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

export interface Equal {
    equals(other: any): Promise<boolean>;
}

export interface FuncBasics extends Equal {
    getFuncName(): string;
    getFuncAstName(): string;
    getQualType(): string;
    getRange(): Range;
}

export interface FuncDeclaration extends FuncBasics {}
export interface FuncImplementation extends FuncBasics {
    getFuncCalls(): Promise<FuncCall[]>;
    addFuncCall(funcCall: FuncCallCreationArgs): Promise<void>;
    getVirtualFuncCalls(): Promise<VirtualFuncCall[]>;
    addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): Promise<void>;
}
export interface FuncCall extends FuncBasics {}

export interface VirtualFuncBasics {
    getBaseFuncAstName(): string;
}

export interface VirtualFuncDeclaration
    extends FuncDeclaration,
        VirtualFuncBasics {}
export interface VirtualFuncImplementation
    extends FuncImplementation,
        VirtualFuncBasics {}
export interface VirtualFuncCall extends FuncCall, VirtualFuncBasics {}

export interface MainDeclLocation extends Equal {
    getClasses(): Promise<CppClass[]>;
    getOrAddClass(className: string): Promise<CppClass>;

    getFuncDecls(): Promise<FuncDeclaration[]>;
    getOrAddFuncDecl(args: FuncCreationArgs): Promise<FuncDeclaration>;
    getFuncImpls(): Promise<FuncImplementation[]>;
    getOrAddFuncImpl(args: FuncCreationArgs): Promise<FuncImplementation>;
    getVirtualFuncImpls(): Promise<VirtualFuncImplementation[]>;
    getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): Promise<VirtualFuncImplementation>;
}

export interface CppClass extends MainDeclLocation {
    getName(): string;
    getParentClasses(): CppClass[];
    getParentClassNames(): string[];
    addParentClass(parentClass: CppClass): void;

    // Virtual functions can be implemented in a class or file but only declared
    // within a class body.
    getVirtualFuncDecls(): VirtualFuncDeclaration[];
    getOrAddVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncDeclaration;

    findBaseFunction(
        funcName: string,
        qualType: string
    ): Promise<VirtualFuncDeclaration | undefined>;
}

export interface CppFile extends MainDeclLocation {
    getName(): string;

    getLastAnalyzed(): number;
    justAnalyzed(): void;
}

export interface HppFile extends CppFile {
    getReferencedFromCppFiles(): string[];
    addReferencedFromCppFile(fileName: string): void;
}
