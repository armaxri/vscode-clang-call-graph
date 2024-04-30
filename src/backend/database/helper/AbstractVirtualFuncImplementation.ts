import {
    FuncCall,
    FuncCallCreationArgs,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    VirtualFuncImplementation,
} from "../cpp_structure";

export abstract class AbstractVirtualFuncImplementation
    implements VirtualFuncImplementation
{
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;
    abstract getBaseFuncAstName(): string;
    abstract getFuncCalls(): FuncCall[];
    abstract addFuncCall(funcCall: FuncCallCreationArgs): void;
    abstract getVirtualFuncCalls(): VirtualFuncCall[];
    abstract addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): void;

    equals(other: VirtualFuncImplementation): boolean {
        throw new Error("Method not implemented.");
    }
}
