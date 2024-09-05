import assert from "assert";
import * as clangAst from "../../../../backend/astWalker/clang/clang_ast_json";
import { addSuitesInSubDirsSuites } from "../../helper/mocha_test_helper";
import { MockUserInterface } from "../../helper/MockUserInterface";
import { MockConfig } from "../../helper/MockConfig";
import { DatabaseType } from "../../../../backend/Config";
import { PathUtils } from "../../../../backend/utils/PathUtils";
import { createDatabase } from "../../../../backend/database/helper/database_factory";
import { loadExpectedLowdbDatabase } from "../ast_walker_test";
import { adjustTsToJsPath } from "../../helper/path_helper";
import { assertDatabaseEquals } from "../../helper/database_equality";
import { ClangAstWalker } from "../../../../backend/astWalker/clang/ClangAstWalker";

suite("Crash Walker Tests", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("missing TranslationUnitDecl", () => {
        const mockConfig = new MockConfig(__dirname, DatabaseType.lowdb);
        const userInterface: MockUserInterface = new MockUserInterface();
        new PathUtils(
            mockConfig.getSelectedDatabasePath().pathString()
        ).tryToRemove();

        const database = createDatabase(mockConfig);

        const fileName = "defectFile.cpp";
        const call = "clang++ blub";

        const fileHandle = userInterface.createFileAnalysisHandle(
            fileName,
            call
        );

        const astWalker = new ClangAstWalker(fileHandle, database, {
            id: "0",
            kind: "clang",
        });

        astWalker.walkAst();

        assert.equal(userInterface.loggedErrors.length, 1);
        assert.ok(
            userInterface.loggedErrors[0].startsWith(
                `Error on walking file "defectFile.cpp" using command "${call}" resulting error message: Expected TranslationUnitDecl, got "clang" as first element.`
            )
        );

        const expectedDatabase = loadExpectedLowdbDatabase(
            adjustTsToJsPath(__dirname),
            "empty_expected_db.json"
        );

        database.writeDatabase();

        assertDatabaseEquals(database, expectedDatabase);
    });
});
