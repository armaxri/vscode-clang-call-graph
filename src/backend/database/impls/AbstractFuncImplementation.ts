import {
    FuncBasics,
    FuncCall,
    FuncCallCreationArgs,
    FuncCreationArgs,
    FuncImplementation,
    Location,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    rangeIsEqual,
} from "../cpp_structure";
import { elementEquals } from "../helper/equality_helper";
import {
    getMatchingFuncsInImpls,
    isLocationWithinRange,
} from "../helper/location_helper";

export abstract class AbstractFuncImplementation implements FuncImplementation {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    abstract getFuncCalls(): FuncCall[];
    abstract addFuncCall(funcCall: FuncCallCreationArgs): FuncCall;
    getOrAddFuncCall(funcCall: FuncCallCreationArgs): FuncCall {
        const existingFuncCall = this.getFuncCalls().find((funcCallCandidate) =>
            funcCallCandidate.baseEquals(funcCall)
        );

        if (existingFuncCall) {
            return existingFuncCall;
        }

        return this.addFuncCall(funcCall);
    }

    abstract getVirtualFuncCalls(): VirtualFuncCall[];
    abstract addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): VirtualFuncCall;
    getOrAddVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): VirtualFuncCall {
        const existingVirtualFuncCall = this.getVirtualFuncCalls().find(
            (funcCallCandidate) => funcCallCandidate.baseEquals(virtualFuncCall)
        );

        if (existingVirtualFuncCall) {
            return existingVirtualFuncCall;
        }

        return this.addVirtualFuncCall(virtualFuncCall);
    }

    equals(otherInput: any): boolean {
        const other = otherInput as FuncImplementation;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return (
            this.getFuncName() === other.getFuncName() &&
            this.getFuncAstName() === other.getFuncAstName() &&
            this.getQualType() === other.getQualType() &&
            rangeIsEqual(this.getRange(), other.getRange()) &&
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

    getMatchingFuncs(location: Location): FuncBasics[] {
        return getMatchingFuncsInImpls(location, this);
    }
}
