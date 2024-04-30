export * from "./cpp_structure";
import { CppFile, HppFile } from "./cpp_structure";

export interface Database {
    getCppFiles(): CppFile[];
    hasCppFile(name: string): boolean;
    getOrAddCppFile(name: string): CppFile;
    removeCppFileAndDependingContent(name: string): void;

    getHppFiles(): CppFile[];
    hasHppFile(name: string): boolean;
    getOrAddHppFile(name: string): HppFile;
    removeHppFileAndDependingContent(name: string): void;

    writeDatabase(): void;
    resetDatabase(): void;

    equals(other: any): boolean;
}
