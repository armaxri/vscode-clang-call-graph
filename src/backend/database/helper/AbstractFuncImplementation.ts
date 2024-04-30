import {
    FuncCall,
    FuncCallCreationArgs,
    FuncImplementation,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
} from "../cpp_structure";

export abstract class AbstractFuncImplementation implements FuncImplementation {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    abstract getFuncCalls(): FuncCall[];
    abstract addFuncCall(funcCall: FuncCallCreationArgs): void;
    abstract getVirtualFuncCalls(): VirtualFuncCall[];
    abstract addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): void;

    equals(other: FuncImplementation): boolean {
        return (
            this.getFuncName() === other.getFuncName() &&
            this.getFuncAstName() === other.getFuncAstName() &&
            this.getQualType() === other.getQualType() &&
            rangeIsEqual(this.getRange(), other.getRange()) &&
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
