import {
    FuncCallCreationArgs,
    FuncCreationArgs,
    VirtualFuncCallCreationArgs,
    VirtualFuncCreationArgs,
} from "../cpp_structure";

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

export function virtualFuncCallArgs2VirtualFuncArgs(
    virtualFuncCall: VirtualFuncCallCreationArgs
): VirtualFuncCreationArgs {
    return {
        baseFuncAstName: virtualFuncCall.func.getBaseFuncAstName(),
        funcName: virtualFuncCall.func.getFuncName(),
        funcAstName: virtualFuncCall.func.getFuncAstName(),
        qualType: virtualFuncCall.func.getQualType(),
        range: virtualFuncCall.range,
    };
}
