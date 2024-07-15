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

    private searchAlternativeDecl(func: FuncBasics): FuncBasics {
        throw new Error("Method not implemented.");
    }

    private searchAlternativeVirtualDecl(func: FuncBasics): FuncBasics {
        throw new Error("Method not implemented.");
    }

    getFuncImplsOrOneDecl(func: FuncBasics): FuncBasics[] {
        const funcs: FuncBasics[] = [];

        if (!func.isVirtual()) {
            funcs.push(...this.getMatchingFuncImpls(func));

            if (funcs.length === 0) {
                funcs.push(this.searchAlternativeDecl(func));
            }
        } else {
            funcs.push(
                ...this.getMatchingVirtualFuncImpls(func as VirtualFuncBasics)
            );

            if (funcs.length === 0) {
                funcs.push(this.searchAlternativeVirtualDecl(func));
            }
        }

        return funcs;
    }

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
