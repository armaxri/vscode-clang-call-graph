import { Range, VirtualFuncCall } from "../cpp_structure";

export abstract class AbstractVirtualFuncCall implements VirtualFuncCall {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;
    abstract getBaseFuncAstName(): string;

    equals(other: VirtualFuncCall): boolean {
        throw new Error("Method not implemented.");
    }
}
