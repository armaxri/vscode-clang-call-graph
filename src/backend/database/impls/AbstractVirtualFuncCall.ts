import { Range, VirtualFuncCall, rangeIsEqual } from "../cpp_structure";

export abstract class AbstractVirtualFuncCall implements VirtualFuncCall {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;
    abstract getBaseFuncAstName(): string;

    async equals(otherInput: any): Promise<boolean> {
        const other = otherInput as VirtualFuncCall;

        if (!other) {
            return false;
        }

        return (
            this.getFuncName() === other.getFuncName() &&
            this.getFuncAstName() === other.getFuncAstName() &&
            this.getQualType() === other.getQualType() &&
            rangeIsEqual(this.getRange(), other.getRange()) &&
            this.getBaseFuncAstName() === other.getBaseFuncAstName()
        );
    }
}
