import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import {
    getEmptyReferenceDatabase,
    prepareDatabaseEqualityTests,
} from "../../database_equality_tests";

suite("Func Call", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple equality with one call", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_call.json"
                );
                const funcImpl = cppFile.addFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = cppFile.addFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 20, column: 10 },
                    },
                });

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    suite("Simple get or add with one call", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_call.json"
                );
                const funcImpl = cppFile.addFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = cppFile.addFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                funcImpl.getOrAddFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 20, column: 10 },
                    },
                });
                funcImpl.getOrAddFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 20, column: 10 },
                    },
                });

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    suite("Equality with multiple calls", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "multiple_simple_func_call.json"
                );
                const funcImpl = cppFile.addFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = cppFile.addFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });
                const subFuncDecl = cppFile.addFuncDecl({
                    funcName: "sub",
                    funcAstName: "__ZN3foo3subEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 12, column: 5 },
                        end: { line: 12, column: 8 },
                    },
                });
                const multiplyFuncDecl = cppFile.addFuncDecl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo8multiplyEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                });
                const divideFuncDecl = cppFile.addFuncDecl({
                    funcName: "divide",
                    funcAstName: "__ZN3foo6divideEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
                });

                funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });
                funcImpl.addFuncCall({
                    func: subFuncDecl,
                    range: {
                        start: { line: 12, column: 5 },
                        end: { line: 12, column: 8 },
                    },
                });
                funcImpl.addFuncCall({
                    func: multiplyFuncDecl,
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                });
                funcImpl.addFuncCall({
                    func: divideFuncDecl,
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
                });

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with multiple calls (missing implementation)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "multiple_simple_func_call.json"
                );
                const funcImpl = cppFile.addFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = cppFile.addFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });
                const subFuncDecl = cppFile.addFuncDecl({
                    funcName: "sub",
                    funcAstName: "__ZN3foo3subEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 12, column: 5 },
                        end: { line: 12, column: 8 },
                    },
                });
                const multiplyFuncDecl = cppFile.addFuncDecl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo8multiplyEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                });
                const divideFuncDecl = cppFile.addFuncDecl({
                    funcName: "divide",
                    funcAstName: "__ZN3foo6divideEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
                });

                funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 20, column: 10 },
                    },
                });
                funcImpl.addFuncCall({
                    func: subFuncDecl,
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                });
                funcImpl.addFuncCall({
                    func: divideFuncDecl,
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
                });

                database.writeDatabase();

                assert.ok(!database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with wrong call name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_call.json"
                );
                const funcImpl = cppFile.addFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = cppFile.addFuncDecl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 20, column: 10 },
                    },
                });

                database.writeDatabase();

                assert.ok(!database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with wrong location", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_call.json"
                );
                const funcImpl = cppFile.addFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = cppFile.addFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 30, column: 10 },
                    },
                });

                database.writeDatabase();

                assert.ok(!database.equals(referenceDatabase));
            });
        });
    });

    suite("Removed all database content", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_call_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_call.json"
                );
                const funcImpl = cppFile.addFuncImpl({
                    funcName: "main",
                    funcAstName: "_main",
                    qualType: "int (int, char **)",
                    range: {
                        start: { line: 5, column: 4 },
                        end: { line: 5, column: 9 },
                    },
                });
                const addFuncDecl = cppFile.addFuncDecl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });

                funcImpl.addFuncCall({
                    func: addFuncDecl,
                    range: {
                        start: { line: 20, column: 6 },
                        end: { line: 20, column: 10 },
                    },
                });

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));

                database.removeCppFileAndDependingContent(cppFile.getName());
                database.writeDatabase();
                assert.ok(database.equals(getEmptyReferenceDatabase()));
            });
        });
    });
});
