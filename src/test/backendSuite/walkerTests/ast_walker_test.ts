import * as assert from "assert";
import * as fs from "fs";
import { PathUtils } from "../../../backend/utils/PathUtils";
import * as astJson from "../../../backend/clang_ast_json";
import {
    FuncMentioning,
    FuncCall,
    VirtualFuncMentioning,
    VirtualFuncCall,
} from "../../../backend/IDatabase";
import { ClangAstWalker } from "../../../backend/ClangAstWalker";
import { MockDatabase } from "../utils/MockDatabase";
import { adjustTsToJsPath } from "../utils/path_helper";

function loadAst(dirname: string, filename: string): astJson.AstElement {
    const filePath = new PathUtils(dirname, filename);
    const rawFileData = fs.readFileSync(filePath.pathString()).toString();
    const jsonAst = JSON.parse(rawFileData);
    const convertedAst = jsonAst as astJson.AstElement;

    return convertedAst;
}

function orderArrayOfFuncMentioningByFuncNameLineAndColumns(
    input: Array<FuncMentioning>
): Array<FuncMentioning> {
    return input.sort((element0, element1) => {
        return element0.funcAstName > element1.funcAstName
            ? -1
            : element0.funcAstName < element1.funcAstName
            ? 1
            : element0.startLoc.line !== element1.startLoc.line
            ? element0.startLoc.line - element1.startLoc.line
            : element0.startLoc.column - element1.startLoc.column;
    });
}

function orderArrayOfFuncCallByFuncNameLineAndColumn(
    input: Array<FuncCall>
): Array<FuncCall> {
    return input.sort((element0, element1) => {
        return element0.callDetails.funcAstName >
            element1.callDetails.funcAstName
            ? -1
            : element0.callDetails.funcAstName <
              element1.callDetails.funcAstName
            ? 1
            : element0.callDetails.startLoc.line !==
              element1.callDetails.startLoc.line
            ? element0.callDetails.startLoc.line -
              element1.callDetails.startLoc.line
            : element0.callDetails.startLoc.column -
              element1.callDetails.startLoc.column;
    });
}

function orderArrayOfVirtualFuncImplByFuncNameLineAndColumns(
    input: Array<VirtualFuncMentioning>
): Array<VirtualFuncMentioning> {
    return input.sort((element0, element1) => {
        return element0.funcImpl.funcAstName > element1.funcImpl.funcAstName
            ? -1
            : element0.funcImpl.funcAstName < element1.funcImpl.funcAstName
            ? 1
            : element0.funcImpl.startLoc.line !==
              element1.funcImpl.startLoc.line
            ? element0.funcImpl.startLoc.line - element1.funcImpl.startLoc.line
            : element0.funcImpl.startLoc.column -
              element1.funcImpl.startLoc.column;
    });
}

export function testAstWalkerResults(
    callingFileDirName: string,
    filename: string,
    expectedImplementations: Array<FuncMentioning> | undefined,
    expectedCalls: Array<FuncCall> | undefined,
    expectedVirtualImplementations: Array<VirtualFuncMentioning> | undefined,
    expectedVirtualCalls: Array<VirtualFuncCall> | undefined
) {
    const clangAst = loadAst(adjustTsToJsPath(callingFileDirName), filename);
    var database = new MockDatabase();
    var astWalker = new ClangAstWalker(filename, database, clangAst);

    astWalker.walkAst();
    const parsedImplementations = database.funcImplementations;
    const parsedCalls = database.funcCalls;
    const parsedVirtualImplementations = database.virtualFuncImplementation;
    const parsedVirtualCalls = database.virtualFuncCall;

    if (expectedImplementations) {
        assert.deepEqual(
            orderArrayOfFuncMentioningByFuncNameLineAndColumns(
                parsedImplementations
            ),
            orderArrayOfFuncMentioningByFuncNameLineAndColumns(
                expectedImplementations
            )
        );
    }
    if (expectedCalls) {
        assert.deepEqual(
            orderArrayOfFuncCallByFuncNameLineAndColumn(parsedCalls),
            orderArrayOfFuncCallByFuncNameLineAndColumn(expectedCalls)
        );
    }
    if (expectedVirtualImplementations) {
        assert.deepEqual(
            orderArrayOfVirtualFuncImplByFuncNameLineAndColumns(
                parsedVirtualImplementations
            ),
            orderArrayOfVirtualFuncImplByFuncNameLineAndColumns(
                expectedVirtualImplementations
            )
        );
    }
    if (expectedVirtualCalls) {
        assert.deepEqual(
            orderArrayOfFuncCallByFuncNameLineAndColumn(parsedVirtualCalls),
            orderArrayOfFuncCallByFuncNameLineAndColumn(expectedVirtualCalls)
        );
    }
}
