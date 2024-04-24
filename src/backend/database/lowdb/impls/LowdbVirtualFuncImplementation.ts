import {
    FuncCall,
    Range,
    VirtualFuncCall,
    VirtualFuncImplementation,
} from "../../cpp_structure";
import { LowdbFuncCall } from "./LowdbFuncCall";
import { LowdbVirtualFuncCall } from "./LowdbVirtualFuncCall";
import { LowdbInternalVirtualFuncImplementation } from "../lowdb_internal_structure";

export class LowdbVirtualFuncImplementation
    implements VirtualFuncImplementation
{
    internal: LowdbInternalVirtualFuncImplementation;

    constructor(internal: LowdbInternalVirtualFuncImplementation) {
        this.internal = internal;
    }

    getBaseFuncAstName(): string {
        return this.internal.baseFuncAstName;
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
