import {
    FuncBasics,
    FuncCall,
    FuncCallCreationArgs,
    Location,
    Range,
    Ranged,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    VirtualFuncImplementation,
    rangeIsEqual,
} from "../cpp_structure";
import { elementEquals } from "../helper/equality_helper";
import {
    getMatchingFuncsInImpls,
    isLocationWithinRange,
} from "../helper/location_helper";

export abstract class AbstractVirtualFuncImplementation
    implements VirtualFuncImplementation
{
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;
    abstract getBaseFuncAstName(): string;
    abstract getFuncCalls(): FuncCall[];
    abstract addFuncCall(funcCall: FuncCallCreationArgs): FuncCall;
    abstract getVirtualFuncCalls(): VirtualFuncCall[];
    abstract addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): VirtualFuncCall;

    equals(otherInput: any): boolean {
        const other = otherInput as VirtualFuncImplementation;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return (
            this.getFuncName() === other.getFuncName() &&
            this.getFuncAstName() === other.getFuncAstName() &&
            this.getQualType() === other.getQualType() &&
            rangeIsEqual(this.getRange(), other.getRange()) &&
            this.getBaseFuncAstName() === other.getBaseFuncAstName() &&
            elementEquals<FuncCall>(
                this.getFuncCalls(),
                other.getFuncCalls()
            ) &&
            elementEquals<VirtualFuncCall>(
                this.getVirtualFuncCalls(),
                other.getVirtualFuncCalls()
            )
        );
    }

    matchesLocation(location: Location): boolean {
        return isLocationWithinRange(location, this.getRange());
    }

    getMatchingFuncs(location: Location): Ranged[] {
        return getMatchingFuncsInImpls(location, this);
    }
}
