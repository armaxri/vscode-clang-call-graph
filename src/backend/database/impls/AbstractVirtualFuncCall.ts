import {
    File,
    FuncType,
    Location,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    rangeIsEqual,
} from "../cpp_structure";
import { isLocationWithinRange } from "../helper/location_helper";

export abstract class AbstractVirtualFuncCall implements VirtualFuncCall {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;
    abstract getBaseFuncAstName(): string;

    abstract getFile(): File | null;

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

    baseEquals(otherInput: any): boolean {
        const other = otherInput as VirtualFuncCallCreationArgs;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return (
            this.getFuncName() === other.func.getFuncName() &&
            this.getFuncAstName() === other.func.getFuncAstName() &&
            this.getQualType() === other.func.getQualType() &&
            rangeIsEqual(this.getRange(), other.range) &&
            this.getBaseFuncAstName() === other.func.getBaseFuncAstName()
        );
    }

    matchesLocation(location: Location): boolean {
        return isLocationWithinRange(location, this.getRange());
    }

    getFuncType(): FuncType {
        return FuncType.call;
    }

    isVirtual(): boolean {
        return true;
    }
}
