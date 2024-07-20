import {
    File,
    FuncBasics,
    FuncType,
    Location,
    Range,
    VirtualFuncBasics,
} from "./cpp_structure";

export type FuncSearchObjectArgs = {
    funcName?: string;
    funcAstName?: string;
    baseFuncAstName?: string;
    qualType?: string;
    range?: Range;
    file?: File;
    funcType?: FuncType;
    isVirtual?: boolean;
};

export class FuncSearchObject implements FuncBasics, VirtualFuncBasics {
    private funcName: string;
    private funcAstName: string;
    private baseFuncAstName: string;
    private qualType: string;
    private range: Range;
    private file: File | null;
    private funcType: FuncType;
    private isVirtualFunc: boolean;

    constructor(funcArgs: FuncSearchObjectArgs) {
        this.funcName = funcArgs.funcName || "";
        this.funcAstName = funcArgs.funcAstName || "";
        this.baseFuncAstName = funcArgs.baseFuncAstName || "";
        this.qualType = funcArgs.qualType || "";
        this.range = funcArgs.range || {
            start: { line: 0, column: 0 },
            end: { line: 0, column: 0 },
        };
        this.file = funcArgs.file || null;
        this.funcType = funcArgs.funcType || FuncType.declaration;
        this.isVirtualFunc = funcArgs.isVirtual || false;
    }

    getFuncName(): string {
        return this.funcName;
    }

    getFuncAstName(): string {
        return this.funcAstName;
    }

    getBaseFuncAstName(): string {
        return this.baseFuncAstName;
    }

    getQualType(): string {
        return this.qualType;
    }

    getRange(): Range {
        return this.range;
    }

    getFile(): File | null {
        return this.file;
    }

    matchesLocation(location: Location): boolean {
        throw new Error("Method not implemented.");
    }

    baseEquals(otherInput: any): boolean {
        throw new Error("Method not implemented.");
    }

    equals(otherInput: any): boolean {
        throw new Error("Method not implemented.");
    }

    getFuncType(): FuncType {
        return this.funcType;
    }

    isVirtual(): boolean {
        return this.isVirtualFunc;
    }
}
