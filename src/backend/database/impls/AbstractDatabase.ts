import { Config } from "../../Config";
import { CppFile, Database, HppFile } from "../Database";
import { FuncBasics, VirtualFuncBasics } from "../cpp_structure";

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

    getFuncImplsOrOneDecl(func: FuncBasics): FuncBasics[] {
        const funcs: FuncBasics[] = [];

        if (!func.isVirtual()) {
            funcs.push(...this.getMatchingFuncImpls(func));

            if (funcs.length === 0) {
                const decl = func.getFile()?.findFuncDecl(func);
                if (decl) {
                    funcs.push(decl);
                }
            }
        } else {
            funcs.push(
                ...this.getMatchingVirtualFuncImpls(func as VirtualFuncBasics)
            );

            if (funcs.length === 0) {
                const decl = func.getFile()?.findVirtualFuncDecl(func);
                if (decl) {
                    funcs.push(decl);
                }
            }
        }

        return funcs;
    }

    abstract getFuncCallers(func: FuncBasics): FuncBasics[];

    abstract writeDatabase(): void;
    abstract resetDatabase(): void;
}
