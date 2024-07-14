import {
    CppClass,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncImplementation,
    FuncCreationArgs,
    VirtualFuncCreationArgs,
    FuncBasics,
    VirtualFuncBasics,
} from "../../cpp_structure";
import { LowdbCppClass } from "./LowdbCppClass";
import { LowdbFuncDeclaration } from "./LowdbFuncDeclaration";
import { LowdbFuncImplementation } from "./LowdbFuncImplementation";
import { LowdbVirtualFuncImplementation } from "./LowdbVirtualFuncImplementation";
import {
    LowdbInternalDatabase,
    LowdbInternalHppFile,
} from "../lowdb_internal_structure";
import { AbstractHppFile } from "../../impls/AbstractHppFile";
import { LowSync } from "@identityinvest/lowdb";

export class LowdbHppFile extends AbstractHppFile {
    private database: LowSync<LowdbInternalDatabase>;
    private internal: LowdbInternalHppFile;

    constructor(
        database: LowSync<LowdbInternalDatabase>,
        internal: LowdbInternalHppFile
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

    getReferencedFromFiles(): string[] {
        if (!this.internal.referencedFromCppFiles) {
            return [];
        }
        return this.internal.referencedFromCppFiles;
    }

    addReferencedFromFile(fileName: string): void {
        if (!this.internal.referencedFromCppFiles.includes(fileName)) {
            this.internal.referencedFromCppFiles.push(fileName);
        }
    }

    getMatchingFuncImpls(func: FuncBasics): FuncBasics[] {
        const matchingFuncs: FuncBasics[] = [];

        this.getClasses().forEach((innerClass) => {
            matchingFuncs.push(
                ...(innerClass as LowdbCppClass).getMatchingFuncImpls(func)
            );
        });

        this.internal.funcImpls.forEach((internalFuncImpl) => {
            if (
                internalFuncImpl.funcName === func.getFuncName() &&
                internalFuncImpl.funcAstName === func.getFuncAstName() &&
                internalFuncImpl.qualType === func.getQualType()
            ) {
                const newImpl = new LowdbFuncImplementation(internalFuncImpl);
                newImpl.setFile(this);
                matchingFuncs.push(newImpl);
            }
        });

        return matchingFuncs;
    }

    getMatchingVirtualFuncImpls(func: VirtualFuncBasics): VirtualFuncBasics[] {
        const matchingFuncs: VirtualFuncBasics[] = [];

        this.getClasses().forEach((innerClass) => {
            matchingFuncs.push(
                ...(innerClass as LowdbCppClass).getMatchingVirtualFuncImpls(
                    func
                )
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
                newImpl.setFile(this);
                matchingFuncs.push(newImpl);
            }
        });

        return matchingFuncs;
    }
}
