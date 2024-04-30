import { Range, VirtualFuncDeclaration } from "../cpp_structure";

export abstract class AbstractVirtualFuncDeclaration
    implements VirtualFuncDeclaration
{
    abstract getBaseFuncAstName(): string;
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    equals(other: VirtualFuncDeclaration): boolean {
        throw new Error("Method not implemented.");
    }
}
