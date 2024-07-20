import { CppFile, Equal, FuncBasics, HppFile } from "./cpp_structure";

export { CppFile, Equal, HppFile };

export interface Database extends Equal {
    getCppFiles(): CppFile[];
    hasCppFile(name: string): boolean;
    getCppFile(name: string): CppFile | null;
    getOrAddCppFile(name: string): CppFile;
    removeCppFileAndDependingContent(name: string): void;

    getHppFiles(): HppFile[];
    hasHppFile(name: string): boolean;
    getHppFile(name: string): HppFile | null;
    getOrAddHppFile(name: string): HppFile;
    removeHppFileAndDependingContent(name: string): void;

    getFuncImplsOrOneDecl(func: FuncBasics): FuncBasics[];
    getFuncCallers(func: FuncBasics): FuncBasics[];

    writeDatabase(): void;
    resetDatabase(): void;
}
