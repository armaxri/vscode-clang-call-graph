import { Range } from "../../cpp_structure";
import { AbstractVirtualFuncCall } from "../../impls/AbstractVirtualFuncCall";
import { LowdbInternalVirtualFuncMentioning } from "../lowdb_internal_structure";

export class LowdbVirtualFuncCall extends AbstractVirtualFuncCall {
    internal: LowdbInternalVirtualFuncMentioning;

    constructor(internal: LowdbInternalVirtualFuncMentioning) {
        super();

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
