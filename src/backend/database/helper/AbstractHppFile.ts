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
        return (
            this.getName() === other.getName() &&
            // Sadly we can't compare the analyzed time.
            // this.getLastAnalyzed() === other.getLastAnalyzed() &&
            this.getReferencedFromCppFiles().every((fileName) =>
                other.getReferencedFromCppFiles().includes(fileName)
            ) &&
            other
                .getReferencedFromCppFiles()
                .every((fileName) =>
                    this.getReferencedFromCppFiles().includes(fileName)
                ) &&
            this.getClasses().every((cppClass) =>
                other
                    .getClasses()
                    .some((otherCppClass) => cppClass.equals(otherCppClass))
            ) &&
            other
                .getClasses()
                .every((otherCppClass) =>
                    this.getClasses().some((cppClass) =>
                        otherCppClass.equals(cppClass)
                    )
                ) &&
            this.getFuncDecls().every((funcDecl) =>
                other
                    .getFuncDecls()
                    .some((otherFuncDecl) => funcDecl.equals(otherFuncDecl))
            ) &&
            other
                .getFuncDecls()
                .every((otherFuncDecl) =>
                    this.getFuncDecls().some((funcDecl) =>
                        otherFuncDecl.equals(funcDecl)
                    )
                ) &&
            this.getFuncImpls().every((funcImpl) =>
                other
                    .getFuncImpls()
                    .some((otherFuncImpl) => funcImpl.equals(otherFuncImpl))
            ) &&
            other
                .getFuncImpls()
                .every((otherFuncImpl) =>
                    this.getFuncImpls().some((funcImpl) =>
                        otherFuncImpl.equals(funcImpl)
                    )
                ) &&
            this.getVirtualFuncImpls().every((virtualFuncImpl) =>
                other
                    .getVirtualFuncImpls()
                    .some((otherVirtualFuncImpl) =>
                        virtualFuncImpl.equals(otherVirtualFuncImpl)
                    )
            ) &&
            other
                .getVirtualFuncImpls()
                .every((otherVirtualFuncImpl) =>
                    this.getVirtualFuncImpls().some((virtualFuncImpl) =>
                        otherVirtualFuncImpl.equals(virtualFuncImpl)
                    )
                )
        );
    }
}
