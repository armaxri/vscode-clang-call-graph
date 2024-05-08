import {
    CppClass,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncImplementation,
    FuncCreationArgs,
    VirtualFuncCreationArgs,
    rangeIsEqual,
} from "../../cpp_structure";
import { LowdbCppClass } from "./LowdbCppClass";
import { LowdbFuncDeclaration } from "./LowdbFuncDeclaration";
import { LowdbFuncImplementation } from "./LowdbFuncImplementation";
import { LowdbVirtualFuncImplementation } from "./LowdbVirtualFuncImplementation";
import { LowdbInternalHppFile } from "../lowdb_internal_structure";
import { AbstractHppFile } from "../../impls/AbstractHppFile";

export class LowdbHppFile extends AbstractHppFile {
    internal: LowdbInternalHppFile;

    constructor(internal: LowdbInternalHppFile) {
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

    async getClasses(): Promise<CppClass[]> {
        return this.internal.classes.map(
            (internalClass) => new LowdbCppClass(internalClass)
        );
    }

    async getOrAddClass(className: string): Promise<CppClass> {
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

    async getFuncDecls(): Promise<FuncDeclaration[]> {
        return this.internal.funcDecls.map(
            (internalFuncDecl) => new LowdbFuncDeclaration(internalFuncDecl)
        );
    }

    async getOrAddFuncDecl(args: FuncCreationArgs): Promise<FuncDeclaration> {
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

    async getFuncImpls(): Promise<FuncImplementation[]> {
        return this.internal.funcImpls.map(
            (internalFuncImpl) => new LowdbFuncImplementation(internalFuncImpl)
        );
    }

    async getOrAddFuncImpl(
        args: FuncCreationArgs
    ): Promise<FuncImplementation> {
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

    async getVirtualFuncImpls(): Promise<VirtualFuncImplementation[]> {
        return this.internal.virtualFuncImpls.map(
            (internalVirtualFuncImpl) =>
                new LowdbVirtualFuncImplementation(internalVirtualFuncImpl)
        );
    }

    async getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): Promise<VirtualFuncImplementation> {
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

    getReferencedFromCppFiles(): string[] {
        return this.internal.referencedFromCppFiles;
    }

    addReferencedFromCppFile(fileName: string): void {
        if (!this.internal.referencedFromCppFiles.includes(fileName)) {
            this.internal.referencedFromCppFiles.push(fileName);
        }
    }
}
