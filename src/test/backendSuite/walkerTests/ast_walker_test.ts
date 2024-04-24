import * as assert from "assert";
import * as fs from "fs";
import { PathUtils } from "../../../backend/utils/PathUtils";
import * as astJson from "../../../backend/astWalker/clang/clang_ast_json";
import { ClangAstWalker } from "../../../backend/astWalker/clang/ClangAstWalker";
import { MockConfig } from "../utils/MockConfig";
import { adjustTsToJsPath } from "../utils/path_helper";
import { LowdbDatabase } from "../../../backend/database/lowdb/LowdbDatabase";

function loadAst(dirname: string, filename: string): astJson.AstElement {
    const filePath = new PathUtils(dirname, filename);
    const rawFileData = fs.readFileSync(filePath.pathString()).toString();
    const jsonAst = JSON.parse(rawFileData);
    const convertedAst = jsonAst as astJson.AstElement;

    return convertedAst;
}

export function testAstWalkerResults(
    callingFileDirName: string,
    filename: string,
    referenceFilename: string
) {
    const clangAst = loadAst(adjustTsToJsPath(callingFileDirName), filename);
    var mockConfig = new MockConfig(callingFileDirName);
    var database = new LowdbDatabase(mockConfig);
    var astWalker = new ClangAstWalker(filename, database, clangAst);

    astWalker.walkAst();

    database.writeDatabase();

    /*
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
    */
}
