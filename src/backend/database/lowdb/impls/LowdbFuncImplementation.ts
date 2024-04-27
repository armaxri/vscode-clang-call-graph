import {
    FuncCall,
    FuncCallCreationArgs,
    FuncImplementation,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
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

    addFuncCall(funcCall: FuncCallCreationArgs): void {
        this.internal.funcCalls.push({
            funcName: funcCall.func.getFuncName(),
            funcAstName: funcCall.func.getFuncAstName(),
            qualType: funcCall.func.getQualType(),
            range: funcCall.range,
        });
    }

    getVirtualFuncCalls(): VirtualFuncCall[] {
        return this.internal.virtualFuncCalls.map(
            (internalVirtualFuncCall) =>
                new LowdbVirtualFuncCall(internalVirtualFuncCall)
        );
    }

    addVirtualFuncCall(virtualFuncCall: VirtualFuncCallCreationArgs): void {
        this.internal.virtualFuncCalls.push({
            funcName: virtualFuncCall.func.getFuncName(),
            funcAstName: virtualFuncCall.func.getFuncAstName(),
            baseFuncAstName: virtualFuncCall.func.getBaseFuncAstName(),
            qualType: virtualFuncCall.func.getQualType(),
            range: virtualFuncCall.range,
        });
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
