import {
    Location,
    Range,
    VirtualFuncCall,
    rangeIsEqual,
} from "../cpp_structure";
import { isLocationWithinRange } from "../helper/location_helper";

export abstract class AbstractVirtualFuncCall implements VirtualFuncCall {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;
    abstract getBaseFuncAstName(): string;

    equals(otherInput: any): boolean {
        const other = otherInput as VirtualFuncCall;

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

    matchesLocation(location: Location): boolean {
        return isLocationWithinRange(location, this.getRange());
    }
}
