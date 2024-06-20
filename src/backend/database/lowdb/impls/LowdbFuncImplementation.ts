import {
    FuncCall,
    FuncCallCreationArgs,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
} from "../../cpp_structure";
import { LowdbFuncCall } from "./LowdbFuncCall";
import { LowdbVirtualFuncCall } from "./LowdbVirtualFuncCall";
import {
    LowdbInternalFuncImplementation,
    LowdbInternalFuncMentioning,
    LowdbInternalVirtualFuncMentioning,
} from "../lowdb_internal_structure";
import { AbstractFuncImplementation } from "../../impls/AbstractFuncImplementation";

export class LowdbFuncImplementation extends AbstractFuncImplementation {
    internal: LowdbInternalFuncImplementation;

    constructor(internal: LowdbInternalFuncImplementation) {
        super();

        this.internal = internal;
    }

    getFuncCalls(): FuncCall[] {
        return this.internal.funcCalls.map(
            (internalFuncCall) => new LowdbFuncCall(internalFuncCall)
        );
    }

    addFuncCall(funcCall: FuncCallCreationArgs): FuncCall {
        const newCall: LowdbInternalFuncMentioning = {
            funcName: funcCall.func.getFuncName(),
            funcAstName: funcCall.func.getFuncAstName(),
            qualType: funcCall.func.getQualType(),
            range: funcCall.range,
        };
        this.internal.funcCalls.push(newCall);
        return new LowdbFuncCall(newCall);
    }

    getVirtualFuncCalls(): VirtualFuncCall[] {
        return this.internal.virtualFuncCalls.map(
            (internalVirtualFuncCall) =>
                new LowdbVirtualFuncCall(internalVirtualFuncCall)
        );
    }

    addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): VirtualFuncCall {
        const newCall: LowdbInternalVirtualFuncMentioning = {
            funcName: virtualFuncCall.func.getFuncName(),
            funcAstName: virtualFuncCall.func.getFuncAstName(),
            baseFuncAstName: virtualFuncCall.func.getBaseFuncAstName(),
            qualType: virtualFuncCall.func.getQualType(),
            range: virtualFuncCall.range,
        };
        this.internal.virtualFuncCalls.push(newCall);
        return new LowdbVirtualFuncCall(newCall);
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
