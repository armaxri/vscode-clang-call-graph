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

suite("Fail Parsing", () => {
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
        )}/defectHeader.cpp -std=c++20 -o defectHeader.o`;

        const fileHandle = userInterface.createFileAnalysisHandle(
            "defectHeader.cpp",
            call
        );

        const walkerFactory = new ClangAstWalkerFactory();

        assert.equal(walkerFactory.createAstWalker(database, fileHandle), null);
        assert.equal(userInterface.loggedErrors.length, 1);
        assert.ok(
            userInterface.loggedErrors[0].startsWith(
                `Error on parsing file "defectHeader.cpp" using command "${call}" resulting error message: Error: Command failed: clang++ -c`
            )
        );

        const expectedDatabase = loadExpectedLowdbDatabase(
            adjustTsToJsPath(__dirname),
            "empty_expected_db.json"
        );

        database.writeDatabase();

        assertDatabaseEquals(database, expectedDatabase);
        assert.ok(fileHandle.fileHandlingCompleted());
    });
});
