import {
    File,
    FuncCall,
    FuncCallCreationArgs,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
} from "../../cpp_structure";
import { LowdbFuncCall } from "./LowdbFuncCall";
import { LowdbVirtualFuncCall } from "./LowdbVirtualFuncCall";
import {
    LowdbInternalFuncMentioning,
    LowdbInternalVirtualFuncImplementation,
    LowdbInternalVirtualFuncMentioning,
} from "../lowdb_internal_structure";
import { AbstractVirtualFuncImplementation } from "../../impls/AbstractVirtualFuncImplementation";

export class LowdbVirtualFuncImplementation extends AbstractVirtualFuncImplementation {
    internal: LowdbInternalVirtualFuncImplementation;
    private file: File | null = null;

    constructor(internal: LowdbInternalVirtualFuncImplementation) {
        super();

        this.internal = internal;
    }

    setFile(file: File): void {
        this.file = file;
    }

    getFile(): File | null {
        return this.file;
    }

    getBaseFuncAstName(): string {
        return this.internal.baseFuncAstName;
    }

    getFuncCalls(): FuncCall[] {
        return this.internal.funcCalls.map((internalFuncCall) => {
            const newCall = new LowdbFuncCall(internalFuncCall);
            if (this.file) {
                newCall.setFile(this.file as File);
            }
            return newCall;
        });
    }

    addFuncCall(funcCall: FuncCallCreationArgs): FuncCall {
        const newCall: LowdbInternalFuncMentioning = {
            funcName: funcCall.func.getFuncName(),
            funcAstName: funcCall.func.getFuncAstName(),
            qualType: funcCall.func.getQualType(),
            range: funcCall.range,
        };
        this.internal.funcCalls.push(newCall);
        const newReturn = new LowdbFuncCall(newCall);
        if (this.file) {
            newReturn.setFile(this.file as File);
        }
        return newReturn;
    }

    getVirtualFuncCalls(): VirtualFuncCall[] {
        return this.internal.virtualFuncCalls.map((internalVirtualFuncCall) => {
            const newCall = new LowdbVirtualFuncCall(internalVirtualFuncCall);
            if (this.file) {
                newCall.setFile(this.file as File);
            }
            return newCall;
        });
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
        const newReturn = new LowdbVirtualFuncCall(newCall);
        if (this.file) {
            newReturn.setFile(this.file as File);
        }
        return newReturn;
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
