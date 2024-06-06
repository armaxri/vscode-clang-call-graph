import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { prepareDatabaseEqualityTests } from "../../database_equality_tests";

suite("Func Call", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple equality with one call", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_func_call.json"
                );
                const funcImpl = await cppFile.getOrAddFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                await funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 20, column: 10 },
                    },
                });

                await database.writeDatabase();

                assert.ok(await database.equals(referenceDatabase));
            });
        });
    });

    suite("Equality with multiple calls", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "multiple_simple_func_call.json"
                );
                const funcImpl = await cppFile.getOrAddFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });
                const subFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "sub",
                    funcAstName: "__ZN3foo3subEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 12, column: 5 },
                        end: { line: 12, column: 8 },
                    },
                });
                const multiplyFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo8multiplyEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                });
                const divideFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "divide",
                    funcAstName: "__ZN3foo6divideEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
                });

                await funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });
                await funcImpl.addFuncCall({
                    func: subFuncDecl,
                    range: {
                        start: { line: 12, column: 5 },
                        end: { line: 12, column: 8 },
                    },
                });
                await funcImpl.addFuncCall({
                    func: multiplyFuncDecl,
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                });
                await funcImpl.addFuncCall({
                    func: divideFuncDecl,
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
                });

                await database.writeDatabase();

                assert.ok(await database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with multiple calls (missing implementation)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "multiple_simple_func_call.json"
                );
                const funcImpl = await cppFile.getOrAddFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });
                const subFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "sub",
                    funcAstName: "__ZN3foo3subEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 12, column: 5 },
                        end: { line: 12, column: 8 },
                    },
                });
                const multiplyFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo8multiplyEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                });
                const divideFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "divide",
                    funcAstName: "__ZN3foo6divideEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
                });

                await funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 20, column: 10 },
                    },
                });
                await funcImpl.addFuncCall({
                    func: subFuncDecl,
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                });
                await funcImpl.addFuncCall({
                    func: divideFuncDecl,
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
                });

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });

    suite("No equality with wrong call name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_func_call.json"
                );
                const funcImpl = await cppFile.getOrAddFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                await funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 20, column: 10 },
                    },
                });

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });

    suite("No equality with wrong location", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_func_call.json"
                );
                const funcImpl = await cppFile.getOrAddFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = await cppFile.getOrAddFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                await funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 30, column: 10 },
                    },
                });

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });
});
