import {
    FuncCall,
    FuncCallCreationArgs,
    FuncImplementation,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    rangeIsEqual,
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
            this.getFuncCalls().every((funcCall) =>
                other
                    .getFuncCalls()
                    .some((otherFuncCall) => funcCall.equals(otherFuncCall))
            ) &&
            other
                .getFuncCalls()
                .every((otherFuncCall) =>
                    this.getFuncCalls().some((funcCall) =>
                        funcCall.equals(otherFuncCall)
                    )
                ) &&
            this.getVirtualFuncCalls().every((virtualFuncCall) =>
                other
                    .getVirtualFuncCalls()
                    .some((otherVirtualFuncCall) =>
                        virtualFuncCall.equals(otherVirtualFuncCall)
                    )
            ) &&
            other
                .getVirtualFuncCalls()
                .every((otherVirtualFuncCall) =>
                    this.getVirtualFuncCalls().some((virtualFuncCall) =>
                        virtualFuncCall.equals(otherVirtualFuncCall)
                    )
                )
        );
    }
}
