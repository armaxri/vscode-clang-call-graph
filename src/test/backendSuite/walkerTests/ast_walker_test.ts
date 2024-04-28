import * as assert from "assert";
import * as fs from "fs";
import { PathUtils } from "../../../backend/utils/PathUtils";
import * as astJson from "../../../backend/astWalker/clang/clang_ast_json";
import { ClangAstWalker } from "../../../backend/astWalker/clang/ClangAstWalker";
import { MockConfig } from "../utils/MockConfig";
import { adjustTsToJsPath } from "../utils/path_helper";
import { LowdbDatabase } from "../../../backend/database/lowdb/LowdbDatabase";
import {
    LowdbInternalCppFile,
    LowdbInternalDatabase,
    LowdbInternalHppFile,
} from "../../../backend/database/lowdb/lowdb_internal_structure";

function loadAst(dirname: string, filename: string): astJson.AstElement {
    const filePath = new PathUtils(dirname, filename);
    const rawFileData = fs.readFileSync(filePath.pathString()).toString();
    const jsonAst = JSON.parse(rawFileData);
    const convertedAst = jsonAst as astJson.AstElement;

    return convertedAst;
}

function getCppNameFromJsonFile(
    callingFileDirName: string,
    filename: string
): string {
    const testDirPath = adjustTsToJsPath(
        new PathUtils(__dirname).getParentDir().getParentDir().pathString()
    );
    const filePath = new PathUtils(
        adjustTsToJsPath(callingFileDirName),
        filename
    );
    return filePath
        .pathString()
        .replace(testDirPath.toString(), "")
        .replace(".json", ".cpp");
}

function loadExpectedDatabase(
    dirname: string,
    filename: string
): LowdbInternalDatabase {
    const filePath = new PathUtils(dirname, filename);
    const rawFileData = fs.readFileSync(filePath.pathString()).toString();
    const jsonDatabase = JSON.parse(rawFileData);
    const convertedDatabase = jsonDatabase as LowdbInternalDatabase;

    return convertedDatabase;
}

export function createAndRunAstWalker(
    callingFileDirName: string,
    filename: string
): [LowdbDatabase, MockConfig] {
    const clangAst = loadAst(adjustTsToJsPath(callingFileDirName), filename);
    const mockConfig = new MockConfig(callingFileDirName);
    try {
        fs.rmSync(mockConfig.getLowdbDatabasePath());
    } catch (e) {
        // Ignore error.
    }
    const database = new LowdbDatabase(mockConfig);
    const astWalker = new ClangAstWalker(
        getCppNameFromJsonFile(callingFileDirName, filename),
        database,
        clangAst
    );

    astWalker.walkAst();

    database.writeDatabase();

    return [database, mockConfig];
}

export function testAstWalkerResults(
    callingFileDirName: string,
    filename: string,
    referenceFilename: string
) {
    const [database, _] = createAndRunAstWalker(callingFileDirName, filename);
    const expectedDatabase = loadExpectedDatabase(
        adjustTsToJsPath(callingFileDirName),
        referenceFilename
    );

    assert.equal(
        database["database"].data.databaseVersion,
        expectedDatabase.databaseVersion
    );
    checkFileLists(
        database["database"].data.cppFiles,
        expectedDatabase.cppFiles
    );
    checkFileLists(
        database["database"].data.hppFiles,
        expectedDatabase.hppFiles
    );
}

function checkFileLists(
    actualFiles: LowdbInternalCppFile[] | LowdbInternalHppFile[],
    expectedFiles: LowdbInternalCppFile[] | LowdbInternalHppFile[]
) {
    assert.equal(actualFiles.length, expectedFiles.length);
    for (let i = 0; i < actualFiles.length; i++) {
        const actualFile = actualFiles[i];
        const expectedFile = expectedFiles[i];
        assert.equal(actualFile.name, expectedFile.name);
        // This may be checked for checks in the last seconds.
        // assert.equal(actualFile.lastAnalyzed, expectedFile.lastAnalyzed);
        assert.deepEqual(actualFile.classes, expectedFile.classes);
        assert.deepEqual(actualFile.funcDecls, expectedFile.funcDecls);
        assert.deepEqual(actualFile.funcImpls, expectedFile.funcImpls);
        assert.deepEqual(
            actualFile.virtualFuncImpls,
            expectedFile.virtualFuncImpls
        );
        if ("referencedFromCppFiles" in actualFile) {
            assert.deepEqual(
                (actualFile as LowdbInternalHppFile).referencedFromCppFiles,
                (expectedFile as LowdbInternalHppFile).referencedFromCppFiles
            );
        }
    }
}
