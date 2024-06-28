import {
    FuncType,
    Location,
    Range,
    VirtualFuncCreationArgs,
    VirtualFuncDeclaration,
    rangeIsEqual,
} from "../cpp_structure";
import { isLocationWithinRange } from "../helper/location_helper";

export abstract class AbstractVirtualFuncDeclaration
    implements VirtualFuncDeclaration
{
    abstract getBaseFuncAstName(): string;
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    equals(otherInput: any): boolean {
        const other = otherInput as VirtualFuncDeclaration;

        // istanbul ignore next
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

    baseEquals(otherInput: any): boolean {
        const other = otherInput as VirtualFuncCreationArgs;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return (
            this.getFuncName() === other.funcName &&
            this.getFuncAstName() === other.funcAstName &&
            this.getQualType() === other.qualType &&
            rangeIsEqual(this.getRange(), other.range) &&
            this.getBaseFuncAstName() === other.baseFuncAstName
        );
    }

    matchesLocation(location: Location): boolean {
        return isLocationWithinRange(location, this.getRange());
    }

    getFuncType(): FuncType {
        return FuncType.declaration;
    }

    isVirtual(): boolean {
        return true;
    }
}
