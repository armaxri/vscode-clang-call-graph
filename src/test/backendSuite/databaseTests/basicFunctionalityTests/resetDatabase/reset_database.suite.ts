import assert from "assert";
import { DatabaseType } from "../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import {
    loadReferenceDb,
    prepareDatabaseEqualityTests,
} from "../../typeEqualsTests/database_equality_tests";
import { assertDatabaseEquals } from "../../../helper/database_equality";

suite("Reset Database", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Reset Database", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_file_expected_db.json",
                        testData
                    );
                database.getOrAddCppFile("simple_func_decl.json");

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);

                database.resetDatabase();
                database.writeDatabase();

                const emptyDatabase = loadReferenceDb(
                    __dirname,
                    "empty_expected_db.json"
                );

                assertDatabaseEquals(database, emptyDatabase);
            });
        });
    });

    suite("Reset Database with function declaration", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_decl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_decl.json"
                );
                cppFile.addFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);

                database.resetDatabase();
                database.writeDatabase();

                const emptyDatabase = loadReferenceDb(
                    __dirname,
                    "empty_expected_db.json"
                );

                assertDatabaseEquals(database, emptyDatabase);
            });
        });
    });
});
