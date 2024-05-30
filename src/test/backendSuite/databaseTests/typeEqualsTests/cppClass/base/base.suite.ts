import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { prepareDatabaseEqualityTests } from "../../database_equality_tests";

suite("Base", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("No equality based on empty class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_decl_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_func_decl.json"
                );
                cppFile.getOrAddClass("FooClass");

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });

    suite("Wrong class name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_decl_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_func_decl.json"
                );
                const cppClass = await cppFile.getOrAddClass("NotFooClass");
                await cppClass.getOrAddFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });
});
