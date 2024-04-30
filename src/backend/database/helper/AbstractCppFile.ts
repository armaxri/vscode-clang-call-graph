import {
    CppClass,
    CppFile,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
} from "../cpp_structure";

export abstract class AbstractCppFile implements CppFile {
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

    equals(otherInput: any): boolean {
        const other = otherInput as CppFile;

        if (!other) {
            return false;
        }

        return (
            this.getName() === other.getName() &&
            // Sadly we can't compare the analyzed time.
            // this.getLastAnalyzed() === other.getLastAnalyzed() &&
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
            this.getVirtualFuncImpls().every((funcImpl) =>
                other
                    .getVirtualFuncImpls()
                    .some((otherFuncImpl) => funcImpl.equals(otherFuncImpl))
            ) &&
            other
                .getVirtualFuncImpls()
                .every((otherFuncImpl) =>
                    this.getVirtualFuncImpls().some((funcImpl) =>
                        otherFuncImpl.equals(funcImpl)
                    )
                )
        );
    }
}
