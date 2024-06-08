import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { prepareDatabaseEqualityTests } from "../../database_equality_tests";

suite("Cpp Class", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple equality with one class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.getOrAddClass("FooClass");

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    suite("Equality with multiple classes", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.getOrAddClass("FooClassA");
                cppFile.getOrAddClass("FooClassB");
                cppFile.getOrAddClass("FooClassC");
                cppFile.getOrAddClass("FooClassD");

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with multiple classes (missing class)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.getOrAddClass("FooClassA");
                cppFile.getOrAddClass("FooClassB");
                cppFile.getOrAddClass("FooClassD");

                database.writeDatabase();

                assert.ok(!database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with multiple classes (wrong class name)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.getOrAddClass("FooClassX");
                cppFile.getOrAddClass("FooClassB");
                cppFile.getOrAddClass("FooClassC");
                cppFile.getOrAddClass("FooClassD");

                database.writeDatabase();

                assert.ok(!database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with wrong class name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.getOrAddClass("BarClass");

                database.writeDatabase();

                assert.ok(!database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with added to wrong hpp file instead", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_class_expected_db.json",
                        testData
                    );
                const hppFile = database.getOrAddHppFile(
                    "simple_cpp_class.json"
                );
                hppFile.getOrAddClass("BarClass");

                database.writeDatabase();

                assert.ok(!database.equals(referenceDatabase));
            });
        });
    });
});
