import {
    CppClass,
    FuncBasics,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    Location,
    VirtualFuncCreationArgs,
    VirtualFuncDeclaration,
    VirtualFuncImplementation,
} from "../cpp_structure";
import { elementEquals } from "../helper/equality_helper";
import { getMatchingFuncs } from "../helper/location_helper";

export abstract class AbstractCppClass implements CppClass {
    abstract getName(): string;

    abstract getParentClasses(): CppClass[];
    abstract getParentClassNames(): string[];
    abstract addParentClass(parentClass: CppClass): CppClass;
    getOrAddParentClass(parentClass: CppClass): CppClass {
        const foundParent = this.getParentClasses().find(
            (parent) => parent.getName() === parentClass.getName()
        );
        if (foundParent) {
            return foundParent;
        }
        const newParent = this.addParentClass(parentClass);
        return newParent;
    }

    abstract getClasses(): CppClass[];
    abstract addClass(className: string): CppClass;
    getOrAddClass(className: string): CppClass {
        const foundClass = this.getClasses().find(
            (classObj) => classObj.getName() === className
        );
        if (foundClass) {
            return foundClass;
        }
        return this.addClass(className);
    }

    abstract getFuncDecls(): FuncDeclaration[];
    abstract addFuncDecl(args: FuncCreationArgs): FuncDeclaration;
    getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration {
        const foundFunc = this.getFuncDecls().find((func) =>
            func.baseEquals(args)
        );
        if (foundFunc) {
            return foundFunc;
        }
        return this.addFuncDecl(args);
    }

    abstract getFuncImpls(): FuncImplementation[];
    abstract addFuncImpl(args: FuncCreationArgs): FuncImplementation;
    getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation {
        const foundFunc = this.getFuncImpls().find((func) =>
            func.baseEquals(args)
        );
        if (foundFunc) {
            return foundFunc;
        }
        return this.addFuncImpl(args);
    }

    abstract getVirtualFuncDecls(): VirtualFuncDeclaration[];
    abstract addVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncDeclaration;
    getOrAddVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncDeclaration {
        const foundFunc = this.getVirtualFuncDecls().find((func) =>
            func.baseEquals(args)
        );
        if (foundFunc) {
            return foundFunc;
        }
        return this.addVirtualFuncDecl(args);
    }

    abstract getVirtualFuncImpls(): VirtualFuncImplementation[];
    abstract addVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation;
    getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        const foundFunc = this.getVirtualFuncImpls().find((func) =>
            func.baseEquals(args)
        );
        if (foundFunc) {
            return foundFunc;
        }
        return this.addVirtualFuncImpl(args);
    }

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

    equals(otherInput: any): boolean {
        const other = otherInput as CppClass;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return (
            this.getName() === other.getName() &&
            this.parentClassNamesEquals(other.getParentClassNames()) &&
            elementEquals<CppClass>(this.getClasses(), other.getClasses()) &&
            elementEquals<FuncDeclaration>(
                this.getFuncDecls(),
                other.getFuncDecls()
            ) &&
            elementEquals<FuncImplementation>(
                this.getFuncImpls(),
                other.getFuncImpls()
            ) &&
            elementEquals<VirtualFuncDeclaration>(
                this.getVirtualFuncDecls(),
                other.getVirtualFuncDecls()
            ) &&
            elementEquals<VirtualFuncImplementation>(
                this.getVirtualFuncImpls(),
                other.getVirtualFuncImpls()
            )
        );
    }

    getMatchingFuncs(location: Location): FuncBasics[] {
        const matchingFunc = getMatchingFuncs(location, this);

        for (const virtualFuncDecl of this.getVirtualFuncDecls()) {
            if (virtualFuncDecl.matchesLocation(location)) {
                matchingFunc.push(virtualFuncDecl);
            }
        }

        return matchingFunc;
    }
}
