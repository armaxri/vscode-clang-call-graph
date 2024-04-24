import {
    CppClass,
    HppFile,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncImplementation,
} from "../../cpp_structure";
import { LowdbCppClass } from "./LowdbCppClass";
import { LowdbFuncDeclaration } from "./LowdbFuncDeclaration";
import { LowdbFuncImplementation } from "./LowdbFuncImplementation";
import { LowdbVirtualFuncImplementation } from "./LowdbVirtualFuncImplementation";
import { LowdbInternalHppFile } from "../lowdb_internal_structure";

export class LowdbHppFile implements HppFile {
    internal: LowdbInternalHppFile;

    constructor(internal: LowdbInternalHppFile) {
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

    getFuncImpls(): FuncImplementation[] {
        return this.internal.funcImpls.map(
            (internalFuncImpl) => new LowdbFuncImplementation(internalFuncImpl)
        );
    }

    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        return this.internal.virtualFuncImpls.map(
            (internalVirtualFuncImpl) =>
                new LowdbVirtualFuncImplementation(internalVirtualFuncImpl)
        );
    }

    getReferencedFromCppFiles(): string[] {
        return this.internal.referencedFromCppFiles;
    }

    addReferencedFromCppFile(fileName: string): void {
        this.internal.referencedFromCppFiles.push(fileName);
    }
}
