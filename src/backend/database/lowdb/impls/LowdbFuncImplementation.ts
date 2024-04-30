import {
    FuncCall,
    FuncCallCreationArgs,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    rangeIsEqual,
} from "../../cpp_structure";
import { LowdbFuncCall } from "./LowdbFuncCall";
import { LowdbVirtualFuncCall } from "./LowdbVirtualFuncCall";
import { LowdbInternalFuncImplementation } from "../lowdb_internal_structure";
import { AbstractFuncImplementation } from "../../helper/AbstractFuncImplementation";

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

    addFuncCall(funcCall: FuncCallCreationArgs): void {
        const foundFuncCall = this.internal.funcCalls.find(
            (internalFuncCall) =>
                internalFuncCall.funcName === funcCall.func.getFuncName() &&
                internalFuncCall.funcAstName ===
                    funcCall.func.getFuncAstName() &&
                internalFuncCall.qualType === funcCall.func.getQualType() &&
                rangeIsEqual(internalFuncCall.range, funcCall.range)
        );

        if (!foundFuncCall) {
            this.internal.funcCalls.push({
                funcName: funcCall.func.getFuncName(),
                funcAstName: funcCall.func.getFuncAstName(),
                qualType: funcCall.func.getQualType(),
                range: funcCall.range,
            });
        }
    }

    getVirtualFuncCalls(): VirtualFuncCall[] {
        return this.internal.virtualFuncCalls.map(
            (internalVirtualFuncCall) =>
                new LowdbVirtualFuncCall(internalVirtualFuncCall)
        );
    }

    addVirtualFuncCall(virtualFuncCall: VirtualFuncCallCreationArgs): void {
        const foundFuncCall = this.internal.virtualFuncCalls.find(
            (internalFuncCall) =>
                internalFuncCall.funcName ===
                    virtualFuncCall.func.getFuncName() &&
                internalFuncCall.funcAstName ===
                    virtualFuncCall.func.getFuncAstName() &&
                internalFuncCall.baseFuncAstName ===
                    virtualFuncCall.func.getBaseFuncAstName() &&
                internalFuncCall.qualType ===
                    virtualFuncCall.func.getQualType() &&
                rangeIsEqual(internalFuncCall.range, virtualFuncCall.range)
        );

        if (!foundFuncCall) {
            this.internal.virtualFuncCalls.push({
                funcName: virtualFuncCall.func.getFuncName(),
                funcAstName: virtualFuncCall.func.getFuncAstName(),
                baseFuncAstName: virtualFuncCall.func.getBaseFuncAstName(),
                qualType: virtualFuncCall.func.getQualType(),
                range: virtualFuncCall.range,
            });
        }
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
