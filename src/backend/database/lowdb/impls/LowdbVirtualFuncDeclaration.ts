import { File, Range } from "../../cpp_structure";
import { AbstractVirtualFuncDeclaration } from "../../impls/AbstractVirtualFuncDeclaration";
import { LowdbInternalVirtualFuncMentioning } from "../lowdb_internal_structure";

export class LowdbVirtualFuncDeclaration extends AbstractVirtualFuncDeclaration {
    internal: LowdbInternalVirtualFuncMentioning;
    private file: File | null = null;

    constructor(internal: LowdbInternalVirtualFuncMentioning) {
        super();

        this.internal = internal;
    }

    setFile(file: File): void {
        this.file = file;
    }

    getFile(): File | null {
        return this.file;
    }

    getBaseFuncAstName(): string {
        return this.internal.baseFuncAstName;
    }

    getFuncName(): string {
        return this.internal.funcName;
    }

    getFuncAstName(): string {
        return this.internal.funcAstName;
    }

    getQualType(): string {
        return this.internal.qualType;
    }

    getRange(): Range {
        return this.internal.range;
    }
}
