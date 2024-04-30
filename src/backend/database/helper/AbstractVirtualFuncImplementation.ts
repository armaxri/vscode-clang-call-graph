import {
    FuncCall,
    FuncCallCreationArgs,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    VirtualFuncImplementation,
    rangeIsEqual,
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
            this.getFuncCalls().every((funcCall) =>
                other
                    .getFuncCalls()
                    .some((otherFuncCall) => funcCall.equals(otherFuncCall))
            ) &&
            this.getVirtualFuncCalls().every((virtualFuncCall) =>
                other
                    .getVirtualFuncCalls()
                    .some((otherVirtualFuncCall) =>
                        virtualFuncCall.equals(otherVirtualFuncCall)
                    )
            )
        );
    }
}
