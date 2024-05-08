export * from "./cpp_structure";
import { CppFile, Equal, HppFile } from "./cpp_structure";

export interface Database extends Equal {
    getCppFiles(): Promise<CppFile[]>;
    hasCppFile(name: string): Promise<boolean>;
    getOrAddCppFile(name: string): Promise<CppFile>;
    removeCppFileAndDependingContent(name: string): Promise<void>;

    getHppFiles(): Promise<HppFile[]>;
    hasHppFile(name: string): Promise<boolean>;
    getOrAddHppFile(name: string): Promise<HppFile>;
    removeHppFileAndDependingContent(name: string): Promise<void>;

    writeDatabase(): Promise<void>;
    resetDatabase(): Promise<void>;
}
