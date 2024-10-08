import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import {
    getEmptyReferenceDatabase,
    prepareDatabaseEqualityTests,
} from "../../database_equality_tests";
import { assertDatabaseEquals } from "../../../../helper/database_equality";

suite("Cpp Class", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple equality with one class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.addClass("FooClass");

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite("Simple get or add with one class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
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
                cppFile.getOrAddClass("FooClass");

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite("Equality with multiple classes", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.addClass("FooClassA");
                cppFile.addClass("FooClassB");
                cppFile.addClass("FooClassC");
                cppFile.addClass("FooClassD");

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite("No equality with multiple classes (missing class)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.addClass("FooClassA");
                cppFile.addClass("FooClassB");
                cppFile.addClass("FooClassD");

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("No equality with multiple classes (wrong class name)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.addClass("FooClassX");
                cppFile.addClass("FooClassB");
                cppFile.addClass("FooClassC");
                cppFile.addClass("FooClassD");

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("No equality with wrong class name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.addClass("BarClass");

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("No equality with added to wrong hpp file instead", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_class_expected_db.json",
                        testData
                    );
                const hppFile = database.getOrAddHppFile(
                    "simple_cpp_class.json"
                );
                hppFile.addClass("BarClass");

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
                        "simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                cppFile.addClass("FooClass");

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);

                database.removeCppFileAndDependingContent(cppFile.getName());
                database.writeDatabase();
                assertDatabaseEquals(database, getEmptyReferenceDatabase());
            });
        });
    });
});
