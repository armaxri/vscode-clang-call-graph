import { Range, VirtualFuncDeclaration } from "../../cpp_structure";
import { LowdbInternalVirtualFuncMentioning } from "../lowdb_internal_structure";

export class LowdbVirtualFuncDeclaration implements VirtualFuncDeclaration {
    internal: LowdbInternalVirtualFuncMentioning;

    constructor(internal: LowdbInternalVirtualFuncMentioning) {
        this.internal = internal;
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
