import {
    FuncCall,
    FuncCallCreationArgs,
    FuncImplementation,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
} from "../cpp_structure";

export abstract class AbstractFuncImplementation implements FuncImplementation {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    abstract getFuncCalls(): FuncCall[];
    abstract addFuncCall(funcCall: FuncCallCreationArgs): void;
    abstract getVirtualFuncCalls(): VirtualFuncCall[];
    abstract addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): void;

    equals(other: FuncImplementation): boolean {
        throw new Error("Method not implemented.");
    }
}
