import {
    CppClass,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncCreationArgs,
    VirtualFuncDeclaration,
    VirtualFuncImplementation,
} from "../cpp_structure";

export abstract class AbstractCppClass implements CppClass {
    abstract getName(): string;
    abstract getParentClasses(): Array<CppClass>;
    abstract getParentClassNames(): Array<string>;
    abstract addParentClass(parentClass: CppClass): void;

    abstract getClasses(): Array<CppClass>;
    abstract getOrAddClass(className: string): CppClass;

    abstract getFuncDecls(): Array<FuncDeclaration>;
    abstract getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration;
    abstract getFuncImpls(): Array<FuncImplementation>;
    abstract getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation;
    abstract getVirtualFuncDecls(): Array<VirtualFuncDeclaration>;
    abstract getOrAddVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncDeclaration;
    abstract getVirtualFuncImpls(): Array<VirtualFuncImplementation>;
    abstract getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation;

    findBaseFunction(
        funcName: string,
        qualType: string
    ): VirtualFuncDeclaration | undefined {
        for (const parentClass of this.getParentClasses()) {
            const foundFunc = parentClass.findBaseFunction(funcName, qualType);
            if (foundFunc) {
                return foundFunc;
            }
        }

        var foundFunc = this.getVirtualFuncDecls().find(
            (func) =>
                func.getFuncName() === funcName &&
                func.getQualType() === qualType
        );
        if (foundFunc) {
            return foundFunc;
        }
        foundFunc = this.getVirtualFuncImpls().find(
            (func) =>
                func.getFuncName() === funcName &&
                func.getQualType() === qualType
        );
        return foundFunc;
    }

    equals(other: CppClass): boolean {
        return (
            this.getName() === other.getName() &&
            this.getParentClassNames().every((name) =>
                other.getParentClassNames().includes(name)
            ) &&
            other
                .getParentClassNames()
                .every((name) => this.getParentClassNames().includes(name)) &&
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
            this.getVirtualFuncDecls().every((funcDecl) =>
                other
                    .getVirtualFuncDecls()
                    .some((otherFuncDecl) => funcDecl.equals(otherFuncDecl))
            ) &&
            other
                .getVirtualFuncDecls()
                .every((otherFuncDecl) =>
                    this.getVirtualFuncDecls().some((funcDecl) =>
                        otherFuncDecl.equals(funcDecl)
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
