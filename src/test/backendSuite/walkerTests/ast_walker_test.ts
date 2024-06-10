import * as assert from "assert";
import * as fs from "fs";
import { PathUtils } from "../../../backend/utils/PathUtils";
import * as astJson from "../../../backend/astWalker/clang/clang_ast_json";
import { ClangAstWalker } from "../../../backend/astWalker/clang/ClangAstWalker";
import { MockConfig } from "../helper/MockConfig";
import { adjustTsToJsPath } from "../helper/path_helper";
import { LowdbDatabase } from "../../../backend/database/lowdb/LowdbDatabase";
import {
    LowdbInternalCppFile,
    LowdbInternalDatabase,
    LowdbInternalHppFile,
} from "../../../backend/database/lowdb/lowdb_internal_structure";
import { DatabaseType } from "../../../backend/Config";
import { Database } from "../../../backend/database/Database";
import { createDatabase } from "../../../backend/database/helper/database_factory";

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

function loadExpectedLowdbDatabase(
    dirname: string,
    filename: string
): LowdbDatabase {
    const database = new LowdbDatabase(new MockConfig(dirname));
    const expectedDatabase = loadExpectedDatabase(dirname, filename);
    database["database"].data = expectedDatabase;
    return database;
}

async function createAndRunAstWalker(
    callingFileDirName: string,
    filename: string,
    mockConfig: MockConfig
): Promise<Database> {
    new PathUtils(mockConfig.getLowdbDatabasePath().pathString()).tryToRemove();

    var database = createDatabase(mockConfig);
    const astWalker = new ClangAstWalker(
        getCppNameFromJsonFile(callingFileDirName, filename),
        database,
        loadAst(adjustTsToJsPath(callingFileDirName), filename)
    );

    await astWalker.walkAst();

    database.writeDatabase();

    return database;
}

export async function testAstWalkerResults(
    callingFileDirName: string,
    filename: string,
    referenceFilename: string
): Promise<void> {
    const mockConfig = new MockConfig(callingFileDirName);
    const database = (await createAndRunAstWalker(
        callingFileDirName,
        filename,
        mockConfig
    )) as LowdbDatabase;
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

export async function testAstWalkerAgainstSpecificDatabase(
    callingFileDirName: string,
    filename: string,
    referenceFilename: string,
    databaseType: DatabaseType
): Promise<void> {
    const mockConfig = new MockConfig(callingFileDirName, databaseType);
    const database = createAndRunAstWalker(
        callingFileDirName,
        filename,
        mockConfig
    );
    const expectedDatabase = loadExpectedLowdbDatabase(
        adjustTsToJsPath(callingFileDirName),
        referenceFilename
    );

    // TODO: This is somehow not satisfying. Is there a real equal?
    assert.ok((await database).equals(expectedDatabase));
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
