import { Config } from "../../Config";
import { CppFile, Database, HppFile } from "../Database";
import { FuncBasics, VirtualFuncBasics } from "../cpp_structure";
import { elementEquals } from "../helper/equality_helper";

export abstract class AbstractDatabase implements Database {
    protected config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    abstract getCppFiles(): CppFile[];
    hasCppFile(name: string): boolean {
        return this.getCppFile(name) !== null;
    }
    abstract getCppFile(name: string): CppFile | null;
    abstract getOrAddCppFile(name: string): CppFile;
    abstract removeCppFileAndDependingContent(name: string): void;

    abstract getHppFiles(): HppFile[];
    hasHppFile(name: string): boolean {
        return this.getHppFile(name) !== null;
    }
    abstract getHppFile(name: string): HppFile | null;
    abstract getOrAddHppFile(name: string): HppFile;
    abstract removeHppFileAndDependingContent(name: string): void;

    abstract getMatchingFuncImpls(func: FuncBasics): FuncBasics[];
    abstract getMatchingVirtualFuncImpls(
        func: VirtualFuncBasics
    ): VirtualFuncBasics[];

    abstract writeDatabase(): void;
    abstract resetDatabase(): void;

    equals(otherInput: any): boolean {
        const other = otherInput as Database;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return (
            elementEquals<CppFile>(this.getCppFiles(), other.getCppFiles()) &&
            elementEquals<HppFile>(this.getHppFiles(), other.getHppFiles())
        );
    }
}
