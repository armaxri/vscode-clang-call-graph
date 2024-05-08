import { Range } from "../../cpp_structure";
import { AbstractFuncCall } from "../../impls/AbstractFuncCall";
import { LowdbInternalFuncMentioning } from "../lowdb_internal_structure";

export class LowdbFuncCall extends AbstractFuncCall {
    internal: LowdbInternalFuncMentioning;

    constructor(internal: LowdbInternalFuncMentioning) {
        super();

        this.internal = internal;
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
