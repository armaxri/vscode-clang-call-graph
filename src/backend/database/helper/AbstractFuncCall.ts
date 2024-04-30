import { FuncCall, Range } from "../cpp_structure";

export abstract class AbstractFuncCall implements FuncCall {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    equals(other: FuncCall): boolean {
        throw new Error("Method not implemented.");
    }
}
