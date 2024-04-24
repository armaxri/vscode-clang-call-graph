import { FuncCall, Range } from "../../cpp_structure";
import { LowdbInternalFuncMentioning } from "../lowdb_internal_structure";

export class LowdbFuncCall implements FuncCall {
    internal: LowdbInternalFuncMentioning;

    constructor(internal: LowdbInternalFuncMentioning) {
        this.internal = internal;
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
