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
import { assertDatabaseEquals } from "../helper/database_equality";
import { FileAnalysisHandle } from "../../../backend/astWalker/FileAnalysisHandle";
import { MockUserInterface } from "../helper/MockUserInterface";

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

export function loadExpectedLowdbDatabase(
    dirname: string,
    filename: string
): LowdbDatabase {
    const database = new LowdbDatabase(new MockConfig(dirname));
    const expectedDatabase = loadExpectedDatabase(dirname, filename);
    database["database"].data = expectedDatabase;
    return database;
}

function createAndRunAstWalker(
    callingFileDirName: string,
    filenames: string[],
    mockConfig: MockConfig
): Database {
    new PathUtils(
        mockConfig.getSelectedDatabasePath().pathString()
    ).tryToRemove();

    const database = createDatabase(mockConfig);
    const userInterface = new MockUserInterface(mockConfig);

    for (const filename of filenames) {
        const fileHandle = userInterface.createFileAnalysisHandle(
            getCppNameFromJsonFile(callingFileDirName, filename),
            ""
        );

        const astWalker = new ClangAstWalker(
            fileHandle,
            database,
            loadAst(adjustTsToJsPath(callingFileDirName), filename)
        );

        astWalker.walkAst();
    }

    database.writeDatabase();

    return database;
}

export function testAstWalkerResults(
    callingFileDirName: string,
    filenames: string[],
    referenceFilename: string
) {
    const mockConfig = new MockConfig(callingFileDirName);
    const database = createAndRunAstWalker(
        callingFileDirName,
        filenames,
        mockConfig
    ) as LowdbDatabase;
    database.writeDatabase();

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

export function testAstWalkerAgainstSpecificDatabase(
    callingFileDirName: string,
    filenames: string[],
    referenceFilename: string,
    databaseType: DatabaseType
) {
    const mockConfig = new MockConfig(callingFileDirName, databaseType);

    console.log(
        "--------------------------------------------------------------------------------"
    );
    console.log("Starting ast walking.");
    console.log(
        "--------------------------------------------------------------------------------"
    );

    var startTime = new Date().getTime();

    const database = createAndRunAstWalker(
        callingFileDirName,
        filenames,
        mockConfig
    );

    var endTime = new Date().getTime();
    console.log(
        "--------------------------------------------------------------------------------"
    );
    console.log(`Finished ast walking in ${endTime - startTime}ms.`);
    console.log(
        "--------------------------------------------------------------------------------"
    );

    database.writeDatabase();

    const expectedDatabase = loadExpectedLowdbDatabase(
        adjustTsToJsPath(callingFileDirName),
        referenceFilename
    );

    startTime = new Date().getTime();

    console.log(
        "--------------------------------------------------------------------------------"
    );
    console.log("Starting assert checks.");
    console.log(
        "--------------------------------------------------------------------------------"
    );

    assertDatabaseEquals(database, expectedDatabase);

    endTime = new Date().getTime();
    console.log(
        "--------------------------------------------------------------------------------"
    );
    console.log(`Finished assert checks in ${endTime - startTime}ms.`);
    console.log(
        "--------------------------------------------------------------------------------"
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
        if ("referencedFromFiles" in actualFile) {
            assert.deepEqual(
                (actualFile as LowdbInternalHppFile).referencedFromFiles,
                (expectedFile as LowdbInternalHppFile).referencedFromFiles
            );
        }
    }
}
