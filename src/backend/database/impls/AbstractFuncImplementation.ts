import {
    FuncCall,
    FuncCallCreationArgs,
    FuncImplementation,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    rangeIsEqual,
} from "../cpp_structure";
import { elementEquals } from "../helper/equality_helper";

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

    equals(otherInput: any): boolean {
        const other = otherInput as FuncImplementation;

        if (!other) {
            return false;
        }

        return (
            this.getFuncName() === other.getFuncName() &&
            this.getFuncAstName() === other.getFuncAstName() &&
            this.getQualType() === other.getQualType() &&
            rangeIsEqual(this.getRange(), other.getRange()) &&
            elementEquals<FuncCall>(
                this.getFuncCalls(),
                other.getFuncCalls()
            ) &&
            elementEquals<VirtualFuncCall>(
                this.getVirtualFuncCalls(),
                other.getVirtualFuncCalls()
            )
        );
    }
}
