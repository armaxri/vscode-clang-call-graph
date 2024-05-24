import * as assert from "assert";
import { DatabaseType } from "../../../../../backend/Config";
import { prepareDatabaseEqualityTests } from "../database_equality_tests";

suite("Database HppFile equality tests", () => {
    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test equality for simple C++ header file on ${DatabaseType[testData]} with one function declaration`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "simple_func_decl.json"
            );
            await hppFile.getOrAddFuncDecl({
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
        test(`Test equality for simple C++ header file on ${DatabaseType[testData]} with one function implementation`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_impl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "simple_func_impl.json"
            );
            await hppFile.getOrAddFuncImpl({
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
        test(`Test equality for simple C++ header file on ${DatabaseType[testData]} with multiple function declarations`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "multiple_simple_func_decl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "multiple_simple_func_decl.json"
            );
            await hppFile.getOrAddFuncDecl({
                funcName: "add",
                funcAstName: "__ZN3foo3addEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 11, column: 5 },
                    end: { line: 11, column: 8 },
                },
            });
            await hppFile.getOrAddFuncDecl({
                funcName: "sub",
                funcAstName: "__ZN3foo3subEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 12, column: 5 },
                    end: { line: 12, column: 8 },
                },
            });
            await hppFile.getOrAddFuncDecl({
                funcName: "multiply",
                funcAstName: "__ZN3foo8multiplyEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 13, column: 5 },
                    end: { line: 13, column: 13 },
                },
            });
            await hppFile.getOrAddFuncDecl({
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
        test(`Test equality for simple C++ header file on ${DatabaseType[testData]} with multiple function implementations`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "multiple_simple_func_impl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "multiple_simple_func_impl.json"
            );
            await hppFile.getOrAddFuncImpl({
                funcName: "add",
                funcAstName: "__ZN3foo3addEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 11, column: 5 },
                    end: { line: 11, column: 8 },
                },
            });
            await hppFile.getOrAddFuncImpl({
                funcName: "sub",
                funcAstName: "__ZN3foo3subEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 12, column: 5 },
                    end: { line: 12, column: 8 },
                },
            });
            await hppFile.getOrAddFuncImpl({
                funcName: "multiply",
                funcAstName: "__ZN3foo8multiplyEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 13, column: 5 },
                    end: { line: 13, column: 13 },
                },
            });
            await hppFile.getOrAddFuncImpl({
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
        test(`Test not equality for simple C++ header file on ${DatabaseType[testData]} with multiple function declarations (missing declaration)`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "multiple_simple_func_decl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "multiple_simple_func_decl.json"
            );
            await hppFile.getOrAddFuncDecl({
                funcName: "add",
                funcAstName: "__ZN3foo3addEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 11, column: 5 },
                    end: { line: 11, column: 8 },
                },
            });
            await hppFile.getOrAddFuncDecl({
                funcName: "multiply",
                funcAstName: "__ZN3foo8multiplyEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 13, column: 5 },
                    end: { line: 13, column: 13 },
                },
            });
            await hppFile.getOrAddFuncDecl({
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
        test(`Test not equality for simple C++ header file on ${DatabaseType[testData]} with multiple function implementations (missing implementation)`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "multiple_simple_func_impl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "multiple_simple_func_impl.json"
            );
            await hppFile.getOrAddFuncImpl({
                funcName: "add",
                funcAstName: "__ZN3foo3addEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 11, column: 5 },
                    end: { line: 11, column: 8 },
                },
            });
            await hppFile.getOrAddFuncImpl({
                funcName: "multiply",
                funcAstName: "__ZN3foo8multiplyEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 13, column: 5 },
                    end: { line: 13, column: 13 },
                },
            });
            await hppFile.getOrAddFuncImpl({
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
        test(`Test equality for simple C++ header file on ${DatabaseType[testData]} based on empty database`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "empty_file_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile("empty.json");

            await database.writeDatabase();

            assert.ok(await database.equals(referenceDatabase));
        });
    });

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test no equality for simple C++ header file on ${DatabaseType[testData]} based on empty database`, async () => {
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
        test(`Test no equality for simple C++ header file on ${DatabaseType[testData]} based wrong file name with one function declaration`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "stupid_simple_func_decl.json"
            );
            await hppFile.getOrAddFuncDecl({
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
        test(`Test no equality for simple C++ header file on ${DatabaseType[testData]} based wrong file name with one function impl`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_impl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "stupid_simple_func_impl.json"
            );
            await hppFile.getOrAddFuncImpl({
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
        test(`Test no equality for simple C++ header file on ${DatabaseType[testData]} based wrong function name with one function declaration`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "simple_func_decl.json"
            );
            await hppFile.getOrAddFuncDecl({
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
        test(`Test no equality for simple C++ header file on ${DatabaseType[testData]} based wrong function name with one function implementation`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_impl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "simple_func_impl.json"
            );
            await hppFile.getOrAddFuncImpl({
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
        test(`Test no equality for simple C++ header file on ${DatabaseType[testData]} based wrong function location with one function declaration`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "simple_func_decl.json"
            );
            await hppFile.getOrAddFuncDecl({
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

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test no equality for simple C++ header file on ${DatabaseType[testData]} based wrong function location with one function implementation`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_impl_expected_db.json",
                    testData
                );
            const hppFile = await database.getOrAddHppFile(
                "simple_func_impl.json"
            );
            await hppFile.getOrAddFuncImpl({
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
