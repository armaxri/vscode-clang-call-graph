import {
    CppClass,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncCreationArgs,
    VirtualFuncDeclaration,
    VirtualFuncImplementation,
} from "../../cpp_structure";
import { LowdbFuncDeclaration } from "./LowdbFuncDeclaration";
import { LowdbFuncImplementation } from "./LowdbFuncImplementation";
import { LowdbVirtualFuncDeclaration } from "./LowdbVirtualFuncDeclaration";
import { LowdbVirtualFuncImplementation } from "./LowdbVirtualFuncImplementation";
import { LowdbInternalCppClass } from "../lowdb_internal_structure";
import { AbstractCppClass } from "../../impls/AbstractCppClass";

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

    addClass(className: string): CppClass {
        const internalClass = {
            name: className,
            parentClasses: [],
            classes: [],
            funcDecls: [],
            funcImpls: [],
            virtualFuncDecls: [],
            virtualFuncImpls: [],
        };
        this.internal.classes.push(internalClass);

        return new LowdbCppClass(internalClass);
    }

    getFuncDecls(): FuncDeclaration[] {
        return this.internal.funcDecls.map(
            (internalFuncDecl) => new LowdbFuncDeclaration(internalFuncDecl)
        );
    }

    addFuncDecl(args: FuncCreationArgs): FuncDeclaration {
        const internalFuncDecl = {
            funcName: args.funcName,
            funcAstName: args.funcAstName,
            qualType: args.qualType,
            range: args.range,
        };
        this.internal.funcDecls.push(internalFuncDecl);

        return new LowdbFuncDeclaration(internalFuncDecl);
    }

    getFuncImpls(): FuncImplementation[] {
        return this.internal.funcImpls.map(
            (internalFuncImpl) => new LowdbFuncImplementation(internalFuncImpl)
        );
    }

    addFuncImpl(args: FuncCreationArgs): FuncImplementation {
        const internalFuncImpl = {
            funcName: args.funcName,
            funcAstName: args.funcAstName,
            qualType: args.qualType,
            range: args.range,
            funcCalls: [],
            virtualFuncCalls: [],
        };
        this.internal.funcImpls.push(internalFuncImpl);

        return new LowdbFuncImplementation(internalFuncImpl);
    }

    getVirtualFuncDecls(): VirtualFuncDeclaration[] {
        return this.internal.virtualFuncDecls.map(
            (internalVirtualFuncDecl) =>
                new LowdbVirtualFuncDeclaration(internalVirtualFuncDecl)
        );
    }

    addVirtualFuncDecl(args: VirtualFuncCreationArgs): VirtualFuncDeclaration {
        const internalVirtualFuncDecl = {
            funcName: args.funcName,
            funcAstName: args.funcAstName,
            qualType: args.qualType,
            range: args.range,
            baseFuncAstName: args.baseFuncAstName,
        };
        this.internal.virtualFuncDecls.push(internalVirtualFuncDecl);

        return new LowdbVirtualFuncDeclaration(internalVirtualFuncDecl);
    }

    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        return this.internal.virtualFuncImpls.map(
            (internalVirtualFuncImpl) =>
                new LowdbVirtualFuncImplementation(internalVirtualFuncImpl)
        );
    }

    addVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        const internalVirtualFuncImpl = {
            funcName: args.funcName,
            funcAstName: args.funcAstName,
            qualType: args.qualType,
            range: args.range,
            baseFuncAstName: args.baseFuncAstName,
            funcCalls: [],
            virtualFuncCalls: [],
        };
        this.internal.virtualFuncImpls.push(internalVirtualFuncImpl);

        return new LowdbVirtualFuncImplementation(internalVirtualFuncImpl);
    }
}
