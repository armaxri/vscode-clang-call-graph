import { File, Range } from "../../cpp_structure";
import { AbstractFuncDeclaration } from "../../impls/AbstractFuncDeclaration";
import { LowdbInternalFuncMentioning } from "../lowdb_internal_structure";

export class LowdbFuncDeclaration extends AbstractFuncDeclaration {
    internal: LowdbInternalFuncMentioning;
    private file: File | null = null;

    constructor(internal: LowdbInternalFuncMentioning) {
        super();

        this.internal = internal;
    }

    setFile(file: File): void {
        this.file = file;
    }

    getFile(): File | null {
        return this.file;
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
