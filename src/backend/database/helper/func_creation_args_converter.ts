import { FuncCallCreationArgs, FuncCreationArgs } from "../cpp_structure";

export function funcCallArgs2FuncArgs(
    funcCallArgs: FuncCallCreationArgs
): FuncCreationArgs {
    return {
        funcName: funcCallArgs.func.getFuncName(),
        funcAstName: funcCallArgs.func.getFuncAstName(),
        qualType: funcCallArgs.func.getQualType(),
        range: funcCallArgs.range,
    };
}
