import { Range, VirtualFuncCall } from "../../cpp_structure";
import { LowdbInternalVirtualFuncMentioning } from "../lowdb_internal_structure";

export class LowdbVirtualFuncCall implements VirtualFuncCall {
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

    getRange(): Range {
        return this.internal.range;
    }
}
