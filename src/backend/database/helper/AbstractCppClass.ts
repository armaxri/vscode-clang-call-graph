import {
    CppClass,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncCreationArgs,
    VirtualFuncDeclaration,
    VirtualFuncImplementation,
} from "../cpp_structure";
import { elementEquals } from "./equality_helper";

export abstract class AbstractCppClass implements CppClass {
    abstract getName(): string;
    abstract getParentClasses(): CppClass[];
    abstract getParentClassNames(): string[];
    abstract addParentClass(parentClass: CppClass): void;

    abstract getClasses(): CppClass[];
    abstract getOrAddClass(className: string): CppClass;

    abstract getFuncDecls(): FuncDeclaration[];
    abstract getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration;
    abstract getFuncImpls(): FuncImplementation[];
    abstract getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation;
    abstract getVirtualFuncDecls(): VirtualFuncDeclaration[];
    abstract getOrAddVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncDeclaration;
    abstract getVirtualFuncImpls(): VirtualFuncImplementation[];
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

    private parentClassNamesEquals(otherList: string[]): boolean {
        const thisList = this.getParentClassNames();

        if (thisList.length !== otherList.length) {
            return false;
        }

        return (
            thisList.every((fileName) => otherList.includes(fileName)) &&
            otherList.every((fileName) => thisList.includes(fileName))
        );
    }

    async equals(otherInput: any): Promise<boolean> {
        const other = otherInput as CppClass;

        if (!other) {
            return false;
        }

        return (
            this.getName() === other.getName() &&
            this.parentClassNamesEquals(other.getParentClassNames()) &&
            (await elementEquals<FuncDeclaration>(
                this.getFuncDecls(),
                other.getFuncDecls()
            )) &&
            (await elementEquals<FuncImplementation>(
                this.getFuncImpls(),
                other.getFuncImpls()
            )) &&
            (await elementEquals<VirtualFuncDeclaration>(
                this.getVirtualFuncDecls(),
                other.getVirtualFuncDecls()
            )) &&
            (await elementEquals<VirtualFuncImplementation>(
                this.getVirtualFuncImpls(),
                other.getVirtualFuncImpls()
            ))
        );
    }
}
