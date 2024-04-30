import {
    FuncCall,
    FuncCallCreationArgs,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    VirtualFuncImplementation,
} from "../cpp_structure";

export abstract class AbstractVirtualFuncImplementation
    implements VirtualFuncImplementation
{
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;
    abstract getBaseFuncAstName(): string;
    abstract getFuncCalls(): FuncCall[];
    abstract addFuncCall(funcCall: FuncCallCreationArgs): void;
    abstract getVirtualFuncCalls(): VirtualFuncCall[];
    abstract addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): void;

    equals(other: VirtualFuncImplementation): boolean {
        return (
            this.getFuncName() === other.getFuncName() &&
            this.getFuncAstName() === other.getFuncAstName() &&
            this.getQualType() === other.getQualType() &&
            rangeIsEqual(this.getRange(), other.getRange()) &&
            this.getBaseFuncAstName() === other.getBaseFuncAstName() &&
            this.getFuncCalls().length === other.getFuncCalls().length &&
            this.getFuncCalls().every((funcCall, index) =>
                funcCall.equals(other.getFuncCalls()[index])
            ) &&
            this.getVirtualFuncCalls().length ===
                other.getVirtualFuncCalls().length &&
            this.getVirtualFuncCalls().every((virtualFuncCall, index) =>
                virtualFuncCall.equals(other.getVirtualFuncCalls()[index])
            )
        );
    }
}
