import {
    File,
    FuncCreationArgs,
    FuncDeclaration,
    FuncType,
    Location,
    Range,
    rangeIsEqual,
} from "../cpp_structure";
import { isLocationWithinRange } from "../helper/location_helper";

export abstract class AbstractFuncDeclaration implements FuncDeclaration {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    abstract getFile(): File | null;

    baseEquals(otherInput: any): boolean {
        const other = otherInput as FuncCreationArgs;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return (
            this.getFuncName() === other.funcName &&
            this.getFuncAstName() === other.funcAstName &&
            this.getQualType() === other.qualType &&
            rangeIsEqual(this.getRange(), other.range)
        );
    }

    matchesLocation(location: Location): boolean {
        return isLocationWithinRange(location, this.getRange());
    }

    getFuncType(): FuncType {
        return FuncType.declaration;
    }

    isVirtual(): boolean {
        return false;
    }
}
