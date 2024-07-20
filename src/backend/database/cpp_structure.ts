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

export interface InFile {
    // Helper that is used during later analysis of the database content.
    // The optional null is required for the object creation.
    getFile(): File | null;
}

export interface MatchingFuncs {
    getMatchingFuncs(location: Location): FuncBasics[];
}

export enum FuncType {
    declaration = "declaration",
    implementation = "implementation",
    call = "call",
}

export interface FuncBasics extends Equal, InFile {
    getFuncName(): string;
    getFuncAstName(): string;
    getQualType(): string;
    getRange(): Range;

    matchesLocation(location: Location): boolean;
    /// Used to compare creation arguments to the actual object.
    /// Not a true and deep equals, only on the basics.
    baseEquals(otherInput: any): boolean;

    // These are very sad workarounds since TypeScript doesn't
    // support interfaces during runtime. So a comparison like
    // instance of is not working and we need another workaround
    // to get the actual type information.
    // TODO: Evaluate if the databases itself can be refactored
    // using these flags with simplification.
    getFuncType(): FuncType;
    isVirtual(): boolean;
}

export interface FuncImplBasics extends FuncBasics, MatchingFuncs {
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

export interface FuncDeclaration extends FuncBasics {}
export interface FuncImplementation extends FuncImplBasics {}
export interface FuncCall extends FuncBasics {}

export interface VirtualFuncBasics extends FuncBasics {
    getBaseFuncAstName(): string;
}

export interface VirtualFuncDeclaration extends VirtualFuncBasics {}
export interface VirtualFuncImplementation
    extends FuncImplBasics,
        VirtualFuncBasics {}
export interface VirtualFuncCall extends VirtualFuncBasics {}

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

    findFuncDecl(func: FuncBasics): FuncBasics | null;
    findVirtualFuncDecl(func: FuncBasics): FuncBasics | null;
}

export interface CppClass extends MainDeclLocation, InFile {
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

export interface File extends MainDeclLocation {
    getName(): string;

    getIncludes(): File[];

    getLastAnalyzed(): number;
    justAnalyzed(): void;
}

export interface CppFile extends File {}

export interface HppFile extends File {
    getReferencedFromFiles(): string[];
    addReferencedFromFile(fileName: string): void;
}
