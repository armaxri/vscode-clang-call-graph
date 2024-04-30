import { FuncCall, Range } from "../cpp_structure";

export abstract class AbstractFuncCall implements FuncCall {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    equals(other: FuncCall): boolean {
        return (
            this.getFuncName() === other.getFuncName() &&
            this.getFuncAstName() === other.getFuncAstName() &&
            this.getQualType() === other.getQualType() &&
            rangeIsEqual(this.getRange(), other.getRange())
        );
    }
}
