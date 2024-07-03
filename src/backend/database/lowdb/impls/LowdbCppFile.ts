import {
    CppClass,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
} from "../../cpp_structure";
import { LowdbCppClass } from "./LowdbCppClass";
import { LowdbFuncDeclaration } from "./LowdbFuncDeclaration";
import { LowdbFuncImplementation } from "./LowdbFuncImplementation";
import { LowdbVirtualFuncImplementation } from "./LowdbVirtualFuncImplementation";
import {
    LowdbInternalCppFile,
    LowdbInternalDatabase,
} from "../lowdb_internal_structure";
import { AbstractCppFile } from "../../impls/AbstractCppFile";
import { LowSync } from "@identityinvest/lowdb";

export class LowdbCppFile extends AbstractCppFile {
    private database: LowSync<LowdbInternalDatabase>;
    private internal: LowdbInternalCppFile;

    constructor(
        database: LowSync<LowdbInternalDatabase>,
        internal: LowdbInternalCppFile
    ) {
        super();

        this.database = database;
        this.internal = internal;
    }

    getName(): string {
        return this.internal.name;
    }

    getLastAnalyzed(): number {
        return this.internal.lastAnalyzed;
    }

    justAnalyzed(): void {
        this.internal.lastAnalyzed = Date.now();
    }

    getClasses(): CppClass[] {
        return this.internal.classes.map((internalClass) => {
            const newClass = new LowdbCppClass(this.database, internalClass);
            newClass.setFile(this);
            return newClass;
        });
    }

    addClass(className: string): CppClass {
        const cppClass = {
            name: className,
            parentClasses: [],
            classes: [],
            funcDecls: [],
            funcImpls: [],
            virtualFuncDecls: [],
            virtualFuncImpls: [],
        };
        this.internal.classes.push(cppClass);

        const newClass = new LowdbCppClass(this.database, cppClass);
        newClass.setFile(this);
        return newClass;
    }

    getFuncDecls(): FuncDeclaration[] {
        return this.internal.funcDecls.map((internalFuncDecl) => {
            const newDecl = new LowdbFuncDeclaration(internalFuncDecl);
            newDecl.setFile(this);
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
        newDecl.setFile(this);
        return newDecl;
    }

    getFuncImpls(): FuncImplementation[] {
        return this.internal.funcImpls.map((internalFuncImpl) => {
            const newImpl = new LowdbFuncImplementation(internalFuncImpl);
            newImpl.setFile(this);
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
        newImpl.setFile(this);
        return newImpl;
    }

    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        return this.internal.virtualFuncImpls.map((internalVirtualFuncImpl) => {
            const newFuncImpl = new LowdbVirtualFuncImplementation(
                internalVirtualFuncImpl
            );
            newFuncImpl.setFile(this);
            return newFuncImpl;
        });
    }

    addVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        const internalVirtualFuncImpl = {
            funcName: args.funcName,
            funcAstName: args.funcAstName,
            baseFuncAstName: args.baseFuncAstName,
            qualType: args.qualType,
            range: args.range,
            funcCalls: [],
            virtualFuncCalls: [],
        };
        this.internal.virtualFuncImpls.push(internalVirtualFuncImpl);

        const newFuncImpl = new LowdbVirtualFuncImplementation(
            internalVirtualFuncImpl
        );
        newFuncImpl.setFile(this);
        return newFuncImpl;
    }
}
