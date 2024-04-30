import {
    CppClass,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    HppFile,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
} from "../cpp_structure";

export abstract class AbstractHppFile implements HppFile {
    abstract getReferencedFromCppFiles(): string[];
    abstract addReferencedFromCppFile(fileName: string): void;
    abstract getName(): string;
    abstract getLastAnalyzed(): number;
    abstract justAnalyzed(): void;
    abstract getClasses(): CppClass[];
    abstract getOrAddClass(className: string): CppClass;
    abstract getFuncDecls(): FuncDeclaration[];
    abstract getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration;
    abstract getFuncImpls(): FuncImplementation[];
    abstract getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation;
    abstract getVirtualFuncImpls(): VirtualFuncImplementation[];
    abstract getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation;

    equals(other: HppFile): boolean {
        throw new Error("Method not implemented.");
    }
}
