import {
    CppClass,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
    rangeIsEqual,
} from "../../cpp_structure";
import { LowdbCppClass } from "./LowdbCppClass";
import { LowdbFuncDeclaration } from "./LowdbFuncDeclaration";
import { LowdbFuncImplementation } from "./LowdbFuncImplementation";
import { LowdbVirtualFuncImplementation } from "./LowdbVirtualFuncImplementation";
import { LowdbInternalCppFile } from "../lowdb_internal_structure";
import { AbstractCppFile } from "../../impls/AbstractCppFile";

export class LowdbCppFile extends AbstractCppFile {
    internal: LowdbInternalCppFile;

    constructor(internal: LowdbInternalCppFile) {
        super();

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
            (internalClass) => new LowdbCppClass(internalClass)
        );
    }

    getOrAddClass(className: string): CppClass {
        var cppClass = this.internal.classes.find(
            (internalClass) => internalClass.name === className
        );

        if (!cppClass) {
            cppClass = {
                name: className,
                parentClasses: [],
                classes: [],
                funcDecls: [],
                funcImpls: [],
                virtualFuncDecls: [],
                virtualFuncImpls: [],
            };
            this.internal.classes.push(cppClass);
        }

        return new LowdbCppClass(cppClass);
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
                internalVirtualFuncImpl.baseFuncAstName ===
                    args.baseFuncAstName &&
                internalVirtualFuncImpl.qualType === args.qualType &&
                rangeIsEqual(internalVirtualFuncImpl.range, args.range)
        );

        if (!internalVirtualFuncImpl) {
            internalVirtualFuncImpl = {
                funcName: args.funcName,
                funcAstName: args.funcAstName,
                baseFuncAstName: args.baseFuncAstName,
                qualType: args.qualType,
                range: args.range,
                funcCalls: [],
                virtualFuncCalls: [],
            };
            this.internal.virtualFuncImpls.push(internalVirtualFuncImpl);
        }

        return new LowdbVirtualFuncImplementation(internalVirtualFuncImpl);
    }
}
