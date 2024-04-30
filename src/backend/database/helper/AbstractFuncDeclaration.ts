import { FuncDeclaration, Range } from "../cpp_structure";

export abstract class AbstractFuncDeclaration implements FuncDeclaration {
    abstract getFuncName(): string;
    abstract getFuncAstName(): string;
    abstract getQualType(): string;
    abstract getRange(): Range;

    equals(other: FuncDeclaration): boolean {
        throw new Error("Method not implemented.");
    }
}
