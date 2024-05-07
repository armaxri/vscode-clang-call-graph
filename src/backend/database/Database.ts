export * from "./cpp_structure";
import { CppFile, Equal, HppFile } from "./cpp_structure";

export interface Database extends Equal {
    getCppFiles(): CppFile[];
    hasCppFile(name: string): boolean;
    getOrAddCppFile(name: string): CppFile;
    removeCppFileAndDependingContent(name: string): void;

    getHppFiles(): HppFile[];
    hasHppFile(name: string): boolean;
    getOrAddHppFile(name: string): HppFile;
    removeHppFileAndDependingContent(name: string): void;

    writeDatabase(): void;
    resetDatabase(): void;
}
