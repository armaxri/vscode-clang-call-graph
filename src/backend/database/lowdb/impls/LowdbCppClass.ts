import {
    CppClass,
    File,
    FuncBasics,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncBasics,
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
    private file: File | null = null;

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

    setFile(file: File): void {
        this.file = file;
    }

    getFile(): File | null {
        return this.file;
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

        const newClass = new LowdbCppClass(this.database, internalClass);
        if (this.file) {
            newClass.setFile(this.file);
        }
        return newClass;
    }

    getFuncDecls(): FuncDeclaration[] {
        return this.internal.funcDecls.map((internalFuncDecl) => {
            const newDecl = new LowdbFuncDeclaration(internalFuncDecl);
            if (this.file) {
                newDecl.setFile(this.file);
            }
            return newDecl;
        });
    }

    addFuncDecl(args: FuncCreationArgs): FuncDeclaration {
        const internalFuncDecl = {
            funcName: args.funcName,
            funcAstName: args.funcAstName,
            qualType: args.qualType,
            range: args.range,
        };
        this.internal.funcDecls.push(internalFuncDecl);

        const newDecl = new LowdbFuncDeclaration(internalFuncDecl);
        if (this.file) {
            newDecl.setFile(this.file);
        }
        return newDecl;
    }

    getFuncImpls(): FuncImplementation[] {
        return this.internal.funcImpls.map((internalFuncImpl) => {
            const newImpl = new LowdbFuncImplementation(internalFuncImpl);
            if (this.file) {
                newImpl.setFile(this.file);
            }
            return newImpl;
        });
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

        const newImpl = new LowdbFuncImplementation(internalFuncImpl);
        if (this.file) {
            newImpl.setFile(this.file);
        }
        return newImpl;
    }

    getVirtualFuncDecls(): VirtualFuncDeclaration[] {
        return this.internal.virtualFuncDecls.map((internalVirtualFuncDecl) => {
            const newFuncDecl = new LowdbVirtualFuncDeclaration(
                internalVirtualFuncDecl
            );
            if (this.file) {
                newFuncDecl.setFile(this.file);
            }
            return newFuncDecl;
        });
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

        const newFuncDecl = new LowdbVirtualFuncDeclaration(
            internalVirtualFuncDecl
        );
        if (this.file) {
            newFuncDecl.setFile(this.file);
        }
        return newFuncDecl;
    }

    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        return this.internal.virtualFuncImpls.map((internalVirtualFuncImpl) => {
            const newFuncImpl = new LowdbVirtualFuncImplementation(
                internalVirtualFuncImpl
            );
            if (this.file) {
                newFuncImpl.setFile(this.file);
            }
            return newFuncImpl;
        });
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

        const newFuncImpl = new LowdbVirtualFuncImplementation(
            internalVirtualFuncImpl
        );
        if (this.file) {
            newFuncImpl.setFile(this.file);
        }
        return newFuncImpl;
    }

    getMatchingFuncImpls(func: FuncBasics): FuncBasics[] {
        const matchingFuncs: FuncBasics[] = [];

        this.getClasses().forEach((cppClass) => {
            matchingFuncs.push(
                ...(cppClass as LowdbCppClass).getMatchingFuncImpls(func)
            );
        });

        this.internal.funcImpls.forEach((internalFuncImpl) => {
            if (
                internalFuncImpl.funcName === func.getFuncName() &&
                internalFuncImpl.funcAstName === func.getFuncAstName() &&
                internalFuncImpl.qualType === func.getQualType()
            ) {
                const newImpl = new LowdbFuncImplementation(internalFuncImpl);
                if (this.file) {
                    newImpl.setFile(this.file);
                }
                matchingFuncs.push(newImpl);
            }
        });

        return matchingFuncs;
    }

    getMatchingVirtualFuncImpls(func: VirtualFuncBasics): VirtualFuncBasics[] {
        const matchingFuncs: VirtualFuncBasics[] = [];

        this.getClasses().forEach((cppClass) => {
            matchingFuncs.push(
                ...(cppClass as LowdbCppClass).getMatchingVirtualFuncImpls(func)
            );
        });

        this.internal.virtualFuncImpls.forEach((internalFuncImpl) => {
            if (
                internalFuncImpl.funcName === func.getFuncName() &&
                internalFuncImpl.baseFuncAstName ===
                    func.getBaseFuncAstName() &&
                internalFuncImpl.qualType === func.getQualType()
            ) {
                const newImpl = new LowdbVirtualFuncImplementation(
                    internalFuncImpl
                );
                if (this.file) {
                    newImpl.setFile(this.file);
                }
                matchingFuncs.push(newImpl);
            }
        });

        return matchingFuncs;
    }

    getFuncCallers(func: FuncBasics): FuncBasics[] {
        const matchingFuncs: FuncBasics[] = [];

        this.getClasses().forEach((cppClass) => {
            matchingFuncs.push(
                ...(cppClass as LowdbCppClass).getFuncCallers(func)
            );
        });

        this.getFuncImpls().forEach((funcImpl) => {
            if (
                (funcImpl as LowdbFuncImplementation).hasMatchingFuncCall(func)
            ) {
                matchingFuncs.push(funcImpl);
            }
        });

        this.getVirtualFuncImpls().forEach((virtualFuncImpl) => {
            if (
                (
                    virtualFuncImpl as LowdbVirtualFuncImplementation
                ).hasMatchingFuncCall(func)
            ) {
                matchingFuncs.push(virtualFuncImpl);
            }
        });

        return matchingFuncs;
    }
}
