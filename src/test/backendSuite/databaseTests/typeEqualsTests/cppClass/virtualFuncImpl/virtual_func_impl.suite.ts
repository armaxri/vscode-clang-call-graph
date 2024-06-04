import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { prepareDatabaseEqualityTests } from "../../database_equality_tests";

suite("Virtual Func Impl", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple equality with one function", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_virtual_func_impl.json"
                );
                const cppClass = await cppFile.getOrAddClass("FooClass");
                await cppClass.getOrAddVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
                });

                await database.writeDatabase();

                assert.ok(await database.equals(referenceDatabase));
            });
        });
    });

    suite("Equality with multiple functions", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "multiple_simple_virtual_func_impl.json"
                );
                const cppClass = await cppFile.getOrAddClass("FooClass");
                await cppClass.getOrAddVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
                });
                await cppClass.getOrAddVirtualFuncImpl({
                    funcName: "sub",
                    funcAstName: "__ZN3foo3subEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 12, column: 5 },
                        end: { line: 12, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3subEii",
                });
                await cppClass.getOrAddVirtualFuncImpl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo8multiplyEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 13, column: 5 },
                        end: { line: 13, column: 13 },
                    },
                    baseFuncAstName: "__ZN3foo8multiplyEii",
                });
                await cppClass.getOrAddVirtualFuncImpl({
                    funcName: "divide",
                    funcAstName: "__ZN3foo6divideEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 14, column: 5 },
                        end: { line: 14, column: 11 },
                    },
                    baseFuncAstName: "__ZN3foo6divideEii",
                });

                await database.writeDatabase();

                assert.ok(await database.equals(referenceDatabase));
            });
        });
    });

    suite(
        "No equality with multiple functions (missing implementation)",
        () => {
            [DatabaseType.lowdb, DatabaseType.sqlite].forEach(
                async (testData) => {
                    test(`${DatabaseType[testData]}`, async () => {
                        const [database, referenceDatabase] =
                            await prepareDatabaseEqualityTests(
                                __dirname,
                                "multiple_simple_virtual_func_impl_expected_db.json",
                                testData
                            );
                        const cppFile = await database.getOrAddCppFile(
                            "multiple_simple_virtual_func_impl.json"
                        );
                        const cppClass = await cppFile.getOrAddClass(
                            "FooClass"
                        );
                        await cppClass.getOrAddVirtualFuncImpl({
                            funcName: "add",
                            funcAstName: "__ZN3foo3addEii",
                            qualType: "int (int, int)",
                            range: {
                                start: { line: 11, column: 5 },
                                end: { line: 11, column: 8 },
                            },
                            baseFuncAstName: "__ZN3foo3addEii",
                        });
                        await cppClass.getOrAddVirtualFuncImpl({
                            funcName: "multiply",
                            funcAstName: "__ZN3foo8multiplyEii",
                            qualType: "int (int, int)",
                            range: {
                                start: { line: 13, column: 5 },
                                end: { line: 13, column: 13 },
                            },
                            baseFuncAstName: "__ZN3foo8multiplyEii",
                        });
                        await cppClass.getOrAddVirtualFuncImpl({
                            funcName: "divide",
                            funcAstName: "__ZN3foo6divideEii",
                            qualType: "int (int, int)",
                            range: {
                                start: { line: 14, column: 5 },
                                end: { line: 14, column: 11 },
                            },
                            baseFuncAstName: "__ZN3foo6divideEii",
                        });

                        await database.writeDatabase();

                        assert.ok(!(await database.equals(referenceDatabase)));
                    });
                }
            );
        }
    );

    suite("No equality with wrong function name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_virtual_func_impl.json"
                );
                const cppClass = await cppFile.getOrAddClass("FooClass");
                await cppClass.getOrAddVirtualFuncImpl({
                    funcName: "multiply",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
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
                        "simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_virtual_func_impl.json"
                );
                const cppClass = await cppFile.getOrAddClass("FooClass");
                await cppClass.getOrAddVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 6 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3addEii",
                });

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });

    suite("No equality with wrong base class name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_virtual_func_impl_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_virtual_func_impl.json"
                );
                const cppClass = await cppFile.getOrAddClass("FooClass");
                await cppClass.getOrAddVirtualFuncImpl({
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    qualType: "int (int, int)",
                    range: {
                        start: { line: 11, column: 5 },
                        end: { line: 11, column: 8 },
                    },
                    baseFuncAstName: "__ZN3foo3subEii",
                });

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });
});
