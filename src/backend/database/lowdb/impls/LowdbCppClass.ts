import {
    CppClass,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncCreationArgs,
    VirtualFuncDeclaration,
    VirtualFuncImplementation,
    rangeIsEqual,
} from "../../cpp_structure";
import { LowdbFuncDeclaration } from "./LowdbFuncDeclaration";
import { LowdbFuncImplementation } from "./LowdbFuncImplementation";
import { LowdbVirtualFuncDeclaration } from "./LowdbVirtualFuncDeclaration";
import { LowdbVirtualFuncImplementation } from "./LowdbVirtualFuncImplementation";
import { LowdbInternalCppClass } from "../lowdb_internal_structure";
import { AbstractCppClass } from "../../helper/AbstractCppClass";

export class LowdbCppClass extends AbstractCppClass {
    internal: LowdbInternalCppClass;
    cachedParentClasses: CppClass[] = [];

    constructor(internal: LowdbInternalCppClass) {
        super();

        this.internal = internal;
    }

    getName(): string {
        return this.internal.name;
    }

    getParentClasses(): CppClass[] {
        return this.cachedParentClasses;
    }

    getParentClassNames(): string[] {
        return this.internal.parentClasses;
    }

    addParentClass(parentClass: CppClass): void {
        if (
            !this.internal.parentClasses.find(
                (name) => name === parentClass.getName()
            )
        ) {
            this.internal.parentClasses.push(parentClass.getName());
        }
        // TODO: This is not the best way to handle this.
        // In the future we might need to get the data from the database.
        this.cachedParentClasses.push(parentClass);
    }

    getClasses(): CppClass[] {
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

    getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration {
        var internalFuncDecl = this.internal.funcDecls.find(
            (internalFuncDecl) =>
                internalFuncDecl.funcName === args.funcName &&
                internalFuncDecl.funcAstName === args.funcAstName &&
                internalFuncDecl.qualType === args.qualType &&
                rangeIsEqual(internalFuncDecl.range, args.range)
        );

        if (!internalFuncDecl) {
            internalFuncDecl = {
                funcName: args.funcName,
                funcAstName: args.funcAstName,
                qualType: args.qualType,
                range: args.range,
            };
            this.internal.funcDecls.push(internalFuncDecl);
        }

        return new LowdbFuncDeclaration(internalFuncDecl);
    }

    getFuncImpls(): FuncImplementation[] {
        return this.internal.funcImpls.map(
            (internalFuncImpl) => new LowdbFuncImplementation(internalFuncImpl)
        );
    }

    getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation {
        var internalFuncImpl = this.internal.funcImpls.find(
            (internalFuncImpl) =>
                internalFuncImpl.funcName === args.funcName &&
                internalFuncImpl.funcAstName === args.funcAstName &&
                internalFuncImpl.qualType === args.qualType &&
                rangeIsEqual(internalFuncImpl.range, args.range)
        );

        if (!internalFuncImpl) {
            internalFuncImpl = {
                funcName: args.funcName,
                funcAstName: args.funcAstName,
                qualType: args.qualType,
                range: args.range,
                funcCalls: [],
                virtualFuncCalls: [],
            };
            this.internal.funcImpls.push(internalFuncImpl);
        }

        return new LowdbFuncImplementation(internalFuncImpl);
    }

    getVirtualFuncDecls(): VirtualFuncDeclaration[] {
        return this.internal.virtualFuncDecls.map(
            (internalVirtualFuncDecl) =>
                new LowdbVirtualFuncDeclaration(internalVirtualFuncDecl)
        );
    }

    getOrAddVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncDeclaration {
        var internalVirtualFuncDecl = this.internal.virtualFuncDecls.find(
            (internalVirtualFuncDecl) =>
                internalVirtualFuncDecl.funcName === args.funcName &&
                internalVirtualFuncDecl.funcAstName === args.funcAstName &&
                internalVirtualFuncDecl.qualType === args.qualType &&
                rangeIsEqual(internalVirtualFuncDecl.range, args.range) &&
                internalVirtualFuncDecl.baseFuncAstName === args.baseFuncAstName
        );

        if (!internalVirtualFuncDecl) {
            internalVirtualFuncDecl = {
                funcName: args.funcName,
                funcAstName: args.funcAstName,
                qualType: args.qualType,
                range: args.range,
                baseFuncAstName: args.baseFuncAstName,
            };
            this.internal.virtualFuncDecls.push(internalVirtualFuncDecl);
        }

        return new LowdbVirtualFuncDeclaration(internalVirtualFuncDecl);
    }

    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        return this.internal.virtualFuncImpls.map(
            (internalVirtualFuncImpl) =>
                new LowdbVirtualFuncImplementation(internalVirtualFuncImpl)
        );
    }

    getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        var internalVirtualFuncImpl = this.internal.virtualFuncImpls.find(
            (internalVirtualFuncImpl) =>
                internalVirtualFuncImpl.funcName === args.funcName &&
                internalVirtualFuncImpl.funcAstName === args.funcAstName &&
                internalVirtualFuncImpl.qualType === args.qualType &&
                rangeIsEqual(internalVirtualFuncImpl.range, args.range) &&
                internalVirtualFuncImpl.baseFuncAstName === args.baseFuncAstName
        );

        if (!internalVirtualFuncImpl) {
            internalVirtualFuncImpl = {
                funcName: args.funcName,
                funcAstName: args.funcAstName,
                qualType: args.qualType,
                range: args.range,
                baseFuncAstName: args.baseFuncAstName,
                funcCalls: [],
                virtualFuncCalls: [],
            };
            this.internal.virtualFuncImpls.push(internalVirtualFuncImpl);
        }

        return new LowdbVirtualFuncImplementation(internalVirtualFuncImpl);
    }
}
