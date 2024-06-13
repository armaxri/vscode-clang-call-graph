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
        return this.internal.classes.map(
            (internalClass) => new LowdbCppClass(this.database, internalClass)
        );
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

        return new LowdbCppClass(this.database, cppClass);
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
            baseFuncAstName: args.baseFuncAstName,
            qualType: args.qualType,
            range: args.range,
            funcCalls: [],
            virtualFuncCalls: [],
        };
        this.internal.virtualFuncImpls.push(internalVirtualFuncImpl);

        return new LowdbVirtualFuncImplementation(internalVirtualFuncImpl);
    }
}
