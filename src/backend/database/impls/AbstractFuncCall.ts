import { FuncCall, Location, Range, rangeIsEqual } from "../cpp_structure";
import { isLocationWithinRange } from "../helper/location_helper";

export abstract class AbstractFuncCall implements FuncCall {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    equals(otherInput: any): boolean {
        const other = otherInput as FuncCall;

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

    matchesLocation(location: Location): boolean {
        return isLocationWithinRange(location, this.getRange());
    }
}
