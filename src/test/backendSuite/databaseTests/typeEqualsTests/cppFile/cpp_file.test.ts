import * as assert from "assert";
import { DatabaseType } from "../../../../../backend/Config";
import { prepareDatabaseEqualityTests } from "../database_equality_tests";

suite("Database CppFile equality tests", () => {
    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test equality for simple C++ file on ${DatabaseType[testData]}`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const cppFile = await database.getOrAddCppFile(
                "simple_func_decl.json"
            );
            await cppFile.getOrAddFuncDecl({
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

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test equality for simple C++ file on ${DatabaseType[testData]} with multiple function declarations`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "multiple_simple_func_decl_expected_db.json",
                    testData
                );
            const cppFile = await database.getOrAddCppFile(
                "multiple_simple_func_decl.json"
            );
            await cppFile.getOrAddFuncDecl({
                funcName: "add",
                funcAstName: "__ZN3foo3addEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 11, column: 5 },
                    end: { line: 11, column: 8 },
                },
            });
            await cppFile.getOrAddFuncDecl({
                funcName: "sub",
                funcAstName: "__ZN3foo3subEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 12, column: 5 },
                    end: { line: 12, column: 8 },
                },
            });
            await cppFile.getOrAddFuncDecl({
                funcName: "multiply",
                funcAstName: "__ZN3foo8multiplyEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 13, column: 5 },
                    end: { line: 13, column: 13 },
                },
            });
            await cppFile.getOrAddFuncDecl({
                funcName: "divide",
                funcAstName: "__ZN3foo6divideEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 14, column: 5 },
                    end: { line: 14, column: 11 },
                },
            });

            await database.writeDatabase();

            assert.ok(await database.equals(referenceDatabase));
        });
    });

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test not equality for simple C++ file on ${DatabaseType[testData]} with multiple function declarations (missing declaration)`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "multiple_simple_func_decl_expected_db.json",
                    testData
                );
            const cppFile = await database.getOrAddCppFile(
                "multiple_simple_func_decl.json"
            );
            await cppFile.getOrAddFuncDecl({
                funcName: "add",
                funcAstName: "__ZN3foo3addEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 11, column: 5 },
                    end: { line: 11, column: 8 },
                },
            });
            await cppFile.getOrAddFuncDecl({
                funcName: "multiply",
                funcAstName: "__ZN3foo8multiplyEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 13, column: 5 },
                    end: { line: 13, column: 13 },
                },
            });
            await cppFile.getOrAddFuncDecl({
                funcName: "divide",
                funcAstName: "__ZN3foo6divideEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 14, column: 5 },
                    end: { line: 14, column: 11 },
                },
            });

            await database.writeDatabase();

            assert.ok(!(await database.equals(referenceDatabase)));
        });
    });

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test equality for simple C++ file on ${DatabaseType[testData]} based on empty database`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "empty_file_expected_db.json",
                    testData
                );
            const cppFile = await database.getOrAddCppFile("empty.json");

            await database.writeDatabase();

            assert.ok(await database.equals(referenceDatabase));
        });
    });

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test no equality for simple C++ file on ${DatabaseType[testData]} based on empty database`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );

            await database.writeDatabase();

            assert.ok(!(await database.equals(referenceDatabase)));
        });
    });

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test no equality for simple C++ file on ${DatabaseType[testData]} based wrong file name`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const cppFile = await database.getOrAddCppFile(
                "stupid_simple_func_decl.json"
            );
            await cppFile.getOrAddFuncDecl({
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

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test no equality for simple C++ file on ${DatabaseType[testData]} based wrong function name`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const cppFile = await database.getOrAddCppFile(
                "simple_func_decl.json"
            );
            await cppFile.getOrAddFuncDecl({
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

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test no equality for simple C++ file on ${DatabaseType[testData]} based wrong function location`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const cppFile = await database.getOrAddCppFile(
                "simple_func_decl.json"
            );
            await cppFile.getOrAddFuncDecl({
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
