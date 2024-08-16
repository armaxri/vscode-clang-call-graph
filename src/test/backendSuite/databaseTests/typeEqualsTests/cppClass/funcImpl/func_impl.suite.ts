import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import {
    getEmptyReferenceDatabase,
    prepareDatabaseEqualityTests,
} from "../../database_equality_tests";
import { FuncType } from "../../../../../../backend/database/cpp_structure";
import { assertDatabaseEquals } from "../../../../helper/database_equality";

suite("Func Impl", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple equality with one function", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_impl.json"
                );
                const cppClass = cppFile.addClass("FooClass");
                const funcImpl = cppClass.addFuncImpl({
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

                assert.ok(!funcImpl.isVirtual());
                assert.equal(funcImpl.getFuncType(), FuncType.implementation);
            });
        });
    });

    suite("Simple get or add with one function", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_impl.json"
                );
                const cppClass = cppFile.addClass("FooClass");
                cppClass.getOrAddFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });
                cppClass.getOrAddFuncImpl({
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
            });
        });
    });

    suite("Equality with multiple functions", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "multiple_simple_func_impl.json"
                );
                const cppClass = cppFile.addClass("FooClass");
                cppClass.addFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                });
                cppClass.addFuncImpl({
                    funcName: "sub",
                    funcAstName: "__ZN3foo3subEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 12, column: 5 },
                        end: { line: 12, column: 8 },
                    },
                });
                cppClass.addFuncImpl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo8multiplyEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                });
                cppClass.addFuncImpl({
                    funcName: "divide",
                    funcAstName: "__ZN3foo6divideEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
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
                            "multiple_simple_func_impl_expected_db.json",
                            testData
                        );
                    const cppFile = database.getOrAddCppFile(
                        "multiple_simple_func_impl.json"
                    );
                    const cppClass = cppFile.addClass("FooClass");
                    cppClass.addFuncImpl({
                        funcName: "add",
                        funcAstName: "__ZN3foo3addEii",
                        qualType: "int (int, int)",
                        range: {
                            start: { line: 11, column: 5 },
                            end: { line: 11, column: 8 },
                        },
                    });
                    cppClass.addFuncImpl({
                        funcName: "multiply",
                        funcAstName: "__ZN3foo8multiplyEii",
                        qualType: "int (int, int)",
                        range: {
                            start: { line: 13, column: 5 },
                            end: { line: 13, column: 13 },
                        },
                    });
                    cppClass.addFuncImpl({
                        funcName: "divide",
                        funcAstName: "__ZN3foo6divideEii",
                        qualType: "int (int, int)",
                        range: {
                            start: { line: 14, column: 5 },
                            end: { line: 14, column: 11 },
                        },
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
                        "simple_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_impl.json"
                );
                const cppClass = cppFile.addClass("FooClass");
                cppClass.addFuncImpl({
                    funcName: "multiply",
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

    suite("No equality with wrong location", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_impl.json"
                );
                const cppClass = cppFile.addClass("FooClass");
                cppClass.addFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 6 },
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

    suite("Removed all database content", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_func_impl.json"
                );
                const cppClass = cppFile.addClass("FooClass");
                cppClass.addFuncImpl({
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

                database.removeCppFileAndDependingContent(cppFile.getName());
                database.writeDatabase();
                assertDatabaseEquals(database, getEmptyReferenceDatabase());
            });
        });
    });
});
