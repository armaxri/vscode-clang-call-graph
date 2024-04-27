import { FuncDeclaration, Range } from "../../cpp_structure";
import { LowdbInternalFuncMentioning } from "../lowdb_internal_structure";

export class LowdbFuncDeclaration implements FuncDeclaration {
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

    getQualType(): string {
        return this.internal.qualType;
    }

    getRange(): Range {
        return this.internal.range;
    }
}
