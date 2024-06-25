import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import {
    getEmptyReferenceDatabase,
    prepareDatabaseEqualityTests,
} from "../../database_equality_tests";

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
                const cppClass = cppFile.addClass("BarClass");
                cppClass.addClass("FooClass");

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
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
                const cppClass = cppFile.addClass("BarClass");
                cppClass.getOrAddClass("FooClass");
                cppClass.getOrAddClass("FooClass");

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
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
                const cppClass = cppFile.addClass("BarClass");
                cppClass.addClass("FooClassA");
                cppClass.addClass("FooClassB");
                cppClass.addClass("FooClassC");
                cppClass.addClass("FooClassD");

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
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
                const cppClass = cppFile.addClass("BarClass");
                cppClass.addClass("FooClassA");
                cppClass.addClass("FooClassB");
                cppClass.addClass("FooClassD");

                database.writeDatabase();

                assert.ok(!database.equals(referenceDatabase));
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
                const cppClass = cppFile.addClass("BarClass");
                cppClass.addClass("FooClassX");
                cppClass.addClass("FooClassB");
                cppClass.addClass("FooClassC");
                cppClass.addClass("FooClassD");

                database.writeDatabase();

                assert.ok(!database.equals(referenceDatabase));
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
                const cppClass = cppFile.addClass("BarClass");
                cppClass.addClass("BarClass");

                database.writeDatabase();

                assert.ok(!database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with added to wrong cpp file instead", () => {
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

                assert.ok(!database.equals(referenceDatabase));
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
                    const cppClass = cppFile.addClass("BarClass");
                    cppClass.addClass("FooClass");

                    database.writeDatabase();

                    assert.ok(database.equals(referenceDatabase));

                    database.removeCppFileAndDependingContent(
                        cppFile.getName()
                    );
                    database.writeDatabase();
                    assert.ok(database.equals(getEmptyReferenceDatabase()));
                });
            });
        });
    });
});
