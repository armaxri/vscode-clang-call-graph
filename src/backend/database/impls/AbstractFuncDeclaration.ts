import { FuncDeclaration, Range, rangeIsEqual } from "../cpp_structure";

export abstract class AbstractFuncDeclaration implements FuncDeclaration {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    equals(otherInput: any): boolean {
        const other = otherInput as FuncDeclaration;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return (
            this.getFuncName() === other.getFuncName() &&
            this.getFuncAstName() === other.getFuncAstName() &&
            this.getQualType() === other.getQualType() &&
            rangeIsEqual(this.getRange(), other.getRange())
        );
    }
}
