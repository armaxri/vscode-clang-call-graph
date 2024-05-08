import {
    FuncCall,
    FuncCallCreationArgs,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    VirtualFuncImplementation,
    rangeIsEqual,
} from "../cpp_structure";
import { elementEquals } from "../helper/equality_helper";

export abstract class AbstractVirtualFuncImplementation
    implements VirtualFuncImplementation
{
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;
    abstract getBaseFuncAstName(): string;
    abstract getFuncCalls(): Promise<FuncCall[]>;
    abstract addFuncCall(funcCall: FuncCallCreationArgs): Promise<void>;
    abstract getVirtualFuncCalls(): Promise<VirtualFuncCall[]>;
    abstract addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): Promise<void>;

    async equals(otherInput: any): Promise<boolean> {
        const other = otherInput as VirtualFuncImplementation;

        if (!other) {
            return false;
        }

        return (
            this.getFuncName() === other.getFuncName() &&
            this.getFuncAstName() === other.getFuncAstName() &&
            this.getQualType() === other.getQualType() &&
            rangeIsEqual(this.getRange(), other.getRange()) &&
            this.getBaseFuncAstName() === other.getBaseFuncAstName() &&
            (await elementEquals<FuncCall>(
                await this.getFuncCalls(),
                await other.getFuncCalls()
            )) &&
            (await elementEquals<VirtualFuncCall>(
                await this.getVirtualFuncCalls(),
                await other.getVirtualFuncCalls()
            ))
        );
    }
}
