import * as assert from "assert";
import { DatabaseType } from "../../../../../backend/Config";
import { prepareDatabaseEqualityTests } from "../database_equality_tests";

suite("Database CppClass equality tests", () => {
    [DatabaseType.lowdb].forEach(async (testData) => {
        test(`Test equality for simple C++ class on ${DatabaseType[testData]}`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
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

    [DatabaseType.lowdb].forEach(async (testData) => {
        test(`Test no equality for simple C++ class on ${DatabaseType[testData]} based on empty class`, async () => {
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

    [DatabaseType.lowdb].forEach(async (testData) => {
        test(`Test no equality for simple C++ class on ${DatabaseType[testData]} based wrong class name`, async () => {
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

    [DatabaseType.lowdb].forEach(async (testData) => {
        test(`Test no equality for simple C++ class on ${DatabaseType[testData]} based wrong function name`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
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

    [DatabaseType.lowdb].forEach(async (testData) => {
        test(`Test no equality for simple C++ class on ${DatabaseType[testData]} based wrong function location`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
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
