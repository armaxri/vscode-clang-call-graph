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

    equals(otherInput: any): boolean {
        const other = otherInput as Database;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        var allMatched = true;

        const thisCppFiles = this.getCppFiles();
        const otherCppFiles = other.getCppFiles();
        const thisHppFiles = this.getHppFiles();
        const otherHppFiles = other.getHppFiles();

        thisCppFiles.forEach((cppFile) => {
            if (
                !otherCppFiles.some((otherCppFile) => {
                    if (cppFile.getName() === otherCppFile.getName()) {
                        if (!cppFile.equals(otherCppFile)) {
                            console.log(
                                `CppFile ${cppFile.getName()} not equal`
                            );
                            allMatched = false;
                        }
                        return true;
                    }
                    return false;
                })
            ) {
                allMatched = false;
                console.log(`CppFile ${cppFile.getName()} not found`);
            }
        });

        otherCppFiles.forEach((otherCppFile) => {
            if (
                !thisCppFiles.some((cppFile) => {
                    return cppFile.getName() === otherCppFile.getName();
                })
            ) {
                allMatched = false;
                console.log(`CppFile ${otherCppFile.getName()} not found`);
            }
        });

        thisHppFiles.forEach((hppFile) => {
            if (
                !otherHppFiles.some((otherHppFile) => {
                    if (hppFile.getName() === otherHppFile.getName()) {
                        if (!hppFile.equals(otherHppFile)) {
                            console.log(
                                `HppFile ${hppFile.getName()} not equal`
                            );
                            allMatched = false;
                        }
                        return true;
                    }
                    return false;
                })
            ) {
                allMatched = false;
                console.log(`HppFile ${hppFile.getName()} not found`);
            }
        });

        otherHppFiles.forEach((otherHppFile) => {
            if (
                !thisHppFiles.some((hppFile) => {
                    return hppFile.getName() === otherHppFile.getName();
                })
            ) {
                allMatched = false;
                console.log(`HppFile ${otherHppFile.getName()} not found`);
            }
        });

        return allMatched;
    }
}
