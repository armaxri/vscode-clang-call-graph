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
import {
    LowdbInternalCppClass,
    LowdbInternalDatabase,
} from "../lowdb_internal_structure";
import { AbstractCppClass } from "../../impls/AbstractCppClass";
import { LowSync } from "@identityinvest/lowdb";

export class LowdbCppClass extends AbstractCppClass {
    private database: LowSync<LowdbInternalDatabase>;
    private internal: LowdbInternalCppClass;
    private parentClasses: LowdbCppClass[] = [];

    constructor(
        database: LowSync<LowdbInternalDatabase>,
        internal: LowdbInternalCppClass
    ) {
        super();

        this.database = database;
        this.internal = internal;

        this.loadParentClasses();
    }

    private loadParentClasses(): void {
        this.internal.parentClasses.map((parentClassName) => {
            var parentClass = this.database.data.hppFiles
                .map((hppFile) => hppFile.classes)
                .flat()
                .find((cppClass) => cppClass.name === parentClassName);

            if (!parentClass) {
                parentClass = this.database.data.cppFiles
                    .map((cppFile) => cppFile.classes)
                    .flat()
                    .find((cppClass) => cppClass.name === parentClassName);
            }

            // istanbul ignore if
            if (!parentClass) {
                throw new Error(`Parent class ${parentClassName} not found`);
            }

            this.parentClasses.push(
                new LowdbCppClass(this.database, parentClass)
            );
        });
    }

    getName(): string {
        return this.internal.name;
    }

    getParentClasses(): CppClass[] {
        return this.parentClasses;
    }

    getParentClassNames(): string[] {
        return this.internal.parentClasses;
    }

    addParentClass(parentClass: CppClass): CppClass {
        this.internal.parentClasses.push(parentClass.getName());
        this.parentClasses.push(parentClass as LowdbCppClass);
        return parentClass;
    }

    getClasses(): CppClass[] {
        return this.internal.classes.map(
            (internalClass) => new LowdbCppClass(this.database, internalClass)
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

        return new LowdbCppClass(this.database, internalClass);
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
