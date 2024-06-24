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
    equals(other: any): boolean;
}

export interface Ranged extends Equal {
    getRange(): Range;
}

export interface LocationMatch {
    matchesLocation(location: Location): boolean;
}

export interface MatchingFuncs {
    getMatchingFuncs(location: Location): Ranged[];
}

export interface FuncBasics extends Equal, LocationMatch, Ranged {
    getFuncName(): string;
    getFuncAstName(): string;
    getQualType(): string;

    /// Used to compare creation arguments to the actual object.
    /// Not a true and deep equals, only on the basics.
    baseEquals(otherInput: any): boolean;
}

export interface FuncDeclaration extends FuncBasics {}
export interface FuncImplementation extends FuncBasics, MatchingFuncs {
    getFuncCalls(): FuncCall[];
    addFuncCall(funcCall: FuncCallCreationArgs): FuncCall;
    getOrAddFuncCall(funcCall: FuncCallCreationArgs): FuncCall;

    getVirtualFuncCalls(): VirtualFuncCall[];
    addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): VirtualFuncCall;
    getOrAddVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): VirtualFuncCall;
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

export interface MainDeclLocation extends Equal, MatchingFuncs {
    getClasses(): CppClass[];
    addClass(className: string): CppClass;
    getOrAddClass(className: string): CppClass;

    getFuncDecls(): FuncDeclaration[];
    addFuncDecl(args: FuncCreationArgs): FuncDeclaration;
    getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration;

    getFuncImpls(): FuncImplementation[];
    addFuncImpl(args: FuncCreationArgs): FuncImplementation;
    getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation;

    getVirtualFuncImpls(): VirtualFuncImplementation[];
    addVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation;
    getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation;
}

export interface CppClass extends MainDeclLocation {
    getName(): string;

    getParentClasses(): CppClass[];
    getParentClassNames(): string[];
    addParentClass(parentClass: CppClass): CppClass;
    getOrAddParentClass(parentClass: CppClass): CppClass;

    // Virtual functions can be implemented in a class or file but only declared
    // within a class body.
    getVirtualFuncDecls(): VirtualFuncDeclaration[];
    addVirtualFuncDecl(args: VirtualFuncCreationArgs): VirtualFuncDeclaration;
    getOrAddVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncDeclaration;

    findBaseFunction(
        funcName: string,
        qualType: string
    ): VirtualFuncDeclaration | undefined;
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
