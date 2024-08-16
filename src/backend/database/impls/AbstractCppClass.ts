import {
    CppClass,
    File,
    FuncBasics,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    Location,
    VirtualFuncBasics,
    VirtualFuncCreationArgs,
    VirtualFuncDeclaration,
    VirtualFuncImplementation,
} from "../cpp_structure";
import { getMatchingFuncs } from "../helper/location_helper";

export abstract class AbstractCppClass implements CppClass {
    abstract getName(): string;

    abstract getFile(): File | null;

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

    findFuncDecl(func: FuncBasics): FuncBasics | null {
        var finding = this.getFuncDecls().find(
            (funcDecl) =>
                funcDecl.getFuncAstName() === func.getFuncAstName() &&
                funcDecl.getFuncName() === func.getFuncName() &&
                funcDecl.getQualType() === func.getQualType()
        );

        if (finding) {
            return finding;
        }

        this.getClasses().forEach((element) => {
            const match = element.findFuncDecl(func);
            if (match) {
                finding = match;
                return;
            }
        });

        return finding ? finding : null;
    }

    findVirtualFuncDecl(func: FuncBasics): FuncBasics | null {
        var finding: FuncBasics | undefined = this.getVirtualFuncDecls().find(
            (funcDecl) =>
                funcDecl.getBaseFuncAstName() ===
                    (func as VirtualFuncBasics).getBaseFuncAstName() &&
                funcDecl.getFuncName() ===
                    (func as VirtualFuncBasics).getFuncName() &&
                funcDecl.getQualType() ===
                    (func as VirtualFuncBasics).getQualType()
        );

        if (finding) {
            return finding;
        }

        this.getClasses().forEach((element) => {
            const match = element.findVirtualFuncDecl(func);
            if (match) {
                finding = match;
                return;
            }
        });

        return finding ? finding : null;
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
