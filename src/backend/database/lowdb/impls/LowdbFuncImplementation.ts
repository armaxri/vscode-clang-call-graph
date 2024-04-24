import {
    FuncCall,
    FuncImplementation,
    Range,
    VirtualFuncCall,
} from "../../cpp_structure";
import { LowdbFuncCall } from "./LowdbFuncCall";
import { LowdbVirtualFuncCall } from "./LowdbVirtualFuncCall";
import { LowdbInternalFuncImplementation } from "../lowdb_internal_structure";

export class LowdbFuncImplementation implements FuncImplementation {
    internal: LowdbInternalFuncImplementation;

    constructor(internal: LowdbInternalFuncImplementation) {
        this.internal = internal;
    }

    getFuncCalls(): FuncCall[] {
        return this.internal.funcCalls.map(
            (internalFuncCall) => new LowdbFuncCall(internalFuncCall)
        );
    }

    getVirtualFuncCalls(): VirtualFuncCall[] {
        return this.internal.virtualFuncCalls.map(
            (internalVirtualFuncCall) =>
                new LowdbVirtualFuncCall(internalVirtualFuncCall)
        );
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
