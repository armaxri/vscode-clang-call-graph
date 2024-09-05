import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import { MockUserInterface } from "../../../helper/MockUserInterface";
import { MockConfig } from "../../../helper/MockConfig";
import { DatabaseType } from "../../../../../backend/Config";
import { ClangAstWalkerFactory } from "../../../../../backend/astWalker/clang/ClangAstWalkerFactory";
import { PathUtils } from "../../../../../backend/utils/PathUtils";
import { createDatabase } from "../../../../../backend/database/helper/database_factory";
import { loadExpectedLowdbDatabase } from "../../ast_walker_test";
import { adjustTsToJsPath } from "../../../helper/path_helper";
import { assertDatabaseEquals } from "../../../helper/database_equality";

suite("Passing Parsing", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("run clang error in include name", () => {
        const mockConfig = new MockConfig(__dirname, DatabaseType.lowdb);
        const userInterface: MockUserInterface = new MockUserInterface();
        new PathUtils(
            mockConfig.getSelectedDatabasePath().pathString()
        ).tryToRemove();

        const database = createDatabase(mockConfig);

        const call = `clang++ -c ${__dirname.replace(
            "/out/",
            "/src/"
        )}/simpleMain.cpp -std=c++20 -o simpleMain.o`;

        const fileHandle = userInterface.createFileAnalysisHandle(
            "simpleMain.cpp",
            call
        );

        const walkerFactory = new ClangAstWalkerFactory();

        assert.notEqual(
            walkerFactory.createAstWalker(database, fileHandle),
            null
        );
        assert.equal(userInterface.loggedErrors.length, 0);

        const expectedDatabase = loadExpectedLowdbDatabase(
            adjustTsToJsPath(__dirname),
            // The database the walker wasn't executed on the output.
            "empty_expected_db.json"
        );

        database.writeDatabase();

        assertDatabaseEquals(database, expectedDatabase);
    });
});
