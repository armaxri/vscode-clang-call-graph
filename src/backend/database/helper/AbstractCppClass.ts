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

        const foundFunc = this.getVirtualFuncDecls().find(
            (func) =>
                func.getFuncName() === funcName &&
                func.getQualType() === qualType
        );
        return foundFunc;
    }
}
