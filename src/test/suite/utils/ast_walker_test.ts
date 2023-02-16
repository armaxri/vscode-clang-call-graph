import * as assert from "assert";
import * as fs from "fs";
import { PathUtils } from "../../../utils/PathUtils";
import * as astJson from "../../../clang_ast_json";
import { FuncMentioning, FuncCall } from "../../../IDatabase";
import { ClangAstWalker } from "../../../ClangAstWalker";
import { MockDatabase } from "./MockDatabase";

function adjustTsToJsPath(path: string): string {
    const thisFileDirPath = new PathUtils(path);
    const workspacePath = new PathUtils(
        thisFileDirPath.pathString(),
        "../../../../.."
    ).pathString();
    const workspaceRelativePath = path.replace(workspacePath, "");
    const newWorkspaceRelativePath = workspaceRelativePath.replace(
        "/out/",
        "/src/"
    );
    const newPath = new PathUtils(
        workspacePath,
        newWorkspaceRelativePath
    ).pathString();

    return newPath;
}

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

export function testAstWalkerResults(
    callingFileDirName: string,
    filename: string,
    expectedImplementations: Array<FuncMentioning> | undefined,
    expectedCalls: Array<FuncCall> | undefined
) {
    const clangAst = loadAst(adjustTsToJsPath(callingFileDirName), filename);
    var database = new MockDatabase();
    var astWalker = new ClangAstWalker(clangAst, database);

    astWalker.walkAst();
    const parsedImplementations = database.funcImplementations;
    const parsedCalls = database.funcCalls;

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
}
