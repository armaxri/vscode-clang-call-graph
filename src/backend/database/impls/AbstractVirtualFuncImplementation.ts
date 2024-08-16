import {
    File,
    FuncBasics,
    FuncCall,
    FuncCallCreationArgs,
    FuncType,
    Location,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
    rangeIsEqual,
} from "../cpp_structure";
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

    abstract getFile(): File | null;

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

    getMatchingFuncs(location: Location): FuncBasics[] {
        return getMatchingFuncsInImpls(location, this);
    }

    getFuncType(): FuncType {
        return FuncType.implementation;
    }

    isVirtual(): boolean {
        return true;
    }
}
