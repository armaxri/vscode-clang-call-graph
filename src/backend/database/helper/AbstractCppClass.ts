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
    abstract getParentClasses(): Promise<CppClass[]>;
    abstract getParentClassNames(): string[];
    abstract addParentClass(parentClass: CppClass): void;

    abstract getClasses(): Promise<CppClass[]>;
    abstract getOrAddClass(className: string): Promise<CppClass>;

    abstract getFuncDecls(): Promise<FuncDeclaration[]>;
    abstract getOrAddFuncDecl(args: FuncCreationArgs): Promise<FuncDeclaration>;
    abstract getFuncImpls(): Promise<FuncImplementation[]>;
    abstract getOrAddFuncImpl(
        args: FuncCreationArgs
    ): Promise<FuncImplementation>;
    abstract getVirtualFuncDecls(): Promise<VirtualFuncDeclaration[]>;
    abstract getOrAddVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): Promise<VirtualFuncDeclaration>;
    abstract getVirtualFuncImpls(): Promise<VirtualFuncImplementation[]>;
    abstract getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): Promise<VirtualFuncImplementation>;

    async findBaseFunction(
        funcName: string,
        qualType: string
    ): Promise<VirtualFuncDeclaration | undefined> {
        for (const parentClass of await this.getParentClasses()) {
            const foundFunc = await parentClass.findBaseFunction(
                funcName,
                qualType
            );
            if (foundFunc) {
                return foundFunc;
            }
        }

        var foundFunc = (await this.getVirtualFuncDecls()).find(
            (func) =>
                func.getFuncName() === funcName &&
                func.getQualType() === qualType
        );
        if (foundFunc) {
            return foundFunc;
        }
        foundFunc = (await this.getVirtualFuncImpls()).find(
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
                await this.getFuncDecls(),
                await other.getFuncDecls()
            )) &&
            (await elementEquals<FuncImplementation>(
                await this.getFuncImpls(),
                await other.getFuncImpls()
            )) &&
            (await elementEquals<VirtualFuncDeclaration>(
                await this.getVirtualFuncDecls(),
                await other.getVirtualFuncDecls()
            )) &&
            (await elementEquals<VirtualFuncImplementation>(
                await this.getVirtualFuncImpls(),
                await other.getVirtualFuncImpls()
            ))
        );
    }
}
