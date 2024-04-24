import {
    CppClass,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncDeclaration,
    VirtualFuncImplementation,
} from "../../cpp_structure";
import { LowdbFuncDeclaration } from "./LowdbFuncDeclaration";
import { LowdbFuncImplementation } from "./LowdbFuncImplementation";
import { LowdbVirtualFuncDeclaration } from "./LowdbVirtualFuncDeclaration";
import { LowdbVirtualFuncImplementation } from "./LowdbVirtualFuncImplementation";
import { LowdbInternalCppClass } from "../lowdb_internal_structure";

export class LowdbCppClass implements CppClass {
    internal: LowdbInternalCppClass;

    constructor(internal: LowdbInternalCppClass) {
        this.internal = internal;
    }

    getName(): string {
        return this.internal.name;
    }

    getParentClasses(): CppClass[] {
        return this.internal.parentClasses.map(
            (internalParentClass) => new LowdbCppClass(internalParentClass)
        );
    }

    getClasses(): Array<CppClass> {
        return this.internal.classes.map(
            (internalClass) => new LowdbCppClass(internalClass)
        );
    }

    getOrAddClass(className: string): CppClass {
        var internalClass = this.internal.classes.find(
            (internalClass) => internalClass.name === className
        );

        if (!internalClass) {
            internalClass = {
                name: className,
                parentClasses: [],
                classes: [],
                funcDecls: [],
                funcImpls: [],
                virtualFuncDecls: [],
                virtualFuncImpls: [],
            };
            this.internal.classes.push(internalClass);
        }

        return new LowdbCppClass(internalClass);
    }

    getFuncDecls(): FuncDeclaration[] {
        return this.internal.funcDecls.map(
            (internalFuncDecl) => new LowdbFuncDeclaration(internalFuncDecl)
        );
    }

    getFuncImpls(): FuncImplementation[] {
        return this.internal.funcImpls.map(
            (internalFuncImpl) => new LowdbFuncImplementation(internalFuncImpl)
        );
    }

    getVirtualFuncDecls(): VirtualFuncDeclaration[] {
        return this.internal.virtualFuncDecls.map(
            (internalVirtualFuncDecl) =>
                new LowdbVirtualFuncDeclaration(internalVirtualFuncDecl)
        );
    }

    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        return this.internal.virtualFuncImpls.map(
            (internalVirtualFuncImpl) =>
                new LowdbVirtualFuncImplementation(internalVirtualFuncImpl)
        );
    }
}
