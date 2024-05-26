import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { prepareDatabaseEqualityTests } from "../../database_equality_tests";

suite("Func Decl", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple equality with one function", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "../simple_func_decl_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_func_decl.json"
                );
                const cppClass = await cppFile.getOrAddClass("FooClass");
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

                assert.ok(await database.equals(referenceDatabase));
            });
        });
    });

    suite("Wrong function name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "../simple_func_decl_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_func_decl.json"
                );
                const cppClass = await cppFile.getOrAddClass("FooClass");
                await cppClass.getOrAddFuncDecl({
                    funcName: "multiply",
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

    suite("Wrong function location", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "../simple_func_decl_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_func_decl.json"
                );
                const cppClass = await cppFile.getOrAddClass("FooClass");
                await cppClass.getOrAddFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 6 },
                        end: { line: 11, column: 8 },
                    },
                });

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });
});
