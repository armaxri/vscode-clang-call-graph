import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { prepareDatabaseEqualityTests } from "../../database_equality_tests";
import { delay } from "../../../../../../backend/utils/utils";
import { assertDatabaseEquals } from "../../../../helper/database_equality";

suite("Base", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Empty database", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "empty_file_expected_db.json",
                        testData
                    );
                const hppFile = database.getOrAddHppFile("empty.json");

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite("Wrong file name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_decl_expected_db.json",
                        testData
                    );
                const hppFile = database.getOrAddHppFile(
                    "stupid_simple_func_decl.json"
                );
                hppFile.addFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("Just analyzed", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "empty_file_expected_db.json",
                        testData
                    );

                const timestamp1 = Date.now();
                await delay(2);

                const hppFile = database.getOrAddHppFile("empty.json");
                await delay(2);
                const timestamp2 = Date.now();
                await delay(2);

                assert.ok(hppFile.getLastAnalyzed() > timestamp1);
                assert.ok(hppFile.getLastAnalyzed() < timestamp2);

                await delay(2);
                hppFile.justAnalyzed();

                database.writeDatabase();

                await delay(2);
                const timestamp3 = Date.now();
                await delay(2);

                assertDatabaseEquals(database, referenceDatabase);

                assert.ok(hppFile.getLastAnalyzed() > timestamp2);
                assert.ok(hppFile.getLastAnalyzed() < timestamp3);
            });
        });
    });
});
