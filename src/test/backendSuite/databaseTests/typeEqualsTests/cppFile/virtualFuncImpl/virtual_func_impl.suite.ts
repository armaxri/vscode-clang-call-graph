import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import {
    getEmptyReferenceDatabase,
    prepareDatabaseEqualityTests,
} from "../../database_equality_tests";
import { assertDatabaseEquals } from "../../../../helper/database_equality";

suite("Virtual Func Impl", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple equality with one function", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_virtual_func_impl.json"
                );
                cppFile.addVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
                });

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite("Simple get or add with one function", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_virtual_func_impl.json"
                );
                cppFile.getOrAddVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
                });
                cppFile.getOrAddVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
                });

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite("Equality with multiple functions", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "multiple_simple_virtual_func_impl.json"
                );
                cppFile.addVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
                });
                cppFile.addVirtualFuncImpl({
                    funcName: "sub",
                    funcAstName: "__ZN3foo3subEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 12, column: 5 },
                        end: { line: 12, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3subEii",
                });
                cppFile.addVirtualFuncImpl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo8multiplyEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                    baseFuncAstName: "__ZN3foo8multiplyEii",
                });
                cppFile.addVirtualFuncImpl({
                    funcName: "divide",
                    funcAstName: "__ZN3foo6divideEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
                    baseFuncAstName: "__ZN3foo6divideEii",
                });

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite(
        "No equality with multiple functions (missing implementation)",
        () => {
            [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
                test(`${DatabaseType[testData]}`, () => {
                    const [database, referenceDatabase] =
                        prepareDatabaseEqualityTests(
                            __dirname,
                            "multiple_simple_virtual_func_impl_expected_db.json",
                            testData
                        );
                    const cppFile = database.getOrAddCppFile(
                        "multiple_simple_virtual_func_impl.json"
                    );
                    const cppClass = cppFile.addClass("FooClass");
                    cppFile.addVirtualFuncImpl({
                        funcName: "add",
                        funcAstName: "__ZN3foo3addEii",
                        qualType: "int (int, int)",
                        range: {
                            start: { line: 11, column: 5 },
                            end: { line: 11, column: 8 },
                        },
                        baseFuncAstName: "__ZN3foo3addEii",
                    });
                    cppFile.addVirtualFuncImpl({
                        funcName: "multiply",
                        funcAstName: "__ZN3foo8multiplyEii",
                        qualType: "int (int, int)",
                        range: {
                            start: { line: 13, column: 5 },
                            end: { line: 13, column: 13 },
                        },
                        baseFuncAstName: "__ZN3foo8multiplyEii",
                    });
                    cppFile.addVirtualFuncImpl({
                        funcName: "divide",
                        funcAstName: "__ZN3foo6divideEii",
                        qualType: "int (int, int)",
                        range: {
                            start: { line: 14, column: 5 },
                            end: { line: 14, column: 11 },
                        },
                        baseFuncAstName: "__ZN3foo6divideEii",
                    });

                    database.writeDatabase();

                    assert.throws(() =>
                        assertDatabaseEquals(database, referenceDatabase)
                    );
                });
            });
        }
    );

    suite("No equality with wrong function name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_virtual_func_impl.json"
                );
                cppFile.addVirtualFuncImpl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
                });

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("No equality with wrong location", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_virtual_func_impl.json"
                );
                cppFile.addVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 6 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
                });

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("No equality with wrong base class name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_virtual_func_impl.json"
                );
                cppFile.addVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3subEii",
                });

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("Removed all database conten", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_virtual_func_impl.json"
                );
                cppFile.addVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
                });

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);

                database.removeCppFileAndDependingContent(cppFile.getName());
                database.writeDatabase();
                assertDatabaseEquals(database, getEmptyReferenceDatabase());
            });
        });
    });
});
