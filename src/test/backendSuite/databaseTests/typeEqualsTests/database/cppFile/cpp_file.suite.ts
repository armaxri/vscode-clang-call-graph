import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import {
    getEmptyReferenceDatabase,
    prepareDatabaseEqualityTests,
} from "../../database_equality_tests";
import {
    assertCppFileEquals,
    assertDatabaseEquals,
} from "../../../../helper/database_equality";

suite("Cpp File", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple equality with one file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddCppFile("TestFile.cpp");

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite("Simple equality with one double added file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_file_expected_db.json",
                        testData
                    );
                const firstAdd = database.getOrAddCppFile("TestFile.cpp");
                const secondAdd = database.getOrAddCppFile("TestFile.cpp");
                assertCppFileEquals(firstAdd, secondAdd);

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite("Equality with multiple files", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddCppFile("TestFile.cpp");
                database.getOrAddCppFile("FooFile.cpp");
                database.getOrAddCppFile("BarFile.cpp");

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite("No equality with multiple files (missing file)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddCppFile("FooFile.cpp");
                database.getOrAddCppFile("BarFile.cpp");

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("No equality one additional file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddCppFile("FooFile.cpp");
                database.getOrAddCppFile("BarFile.cpp");

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("No equality with multiple files (wrong file name)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddCppFile("FooFile.cpp");
                database.getOrAddCppFile("FooFile2.cpp");
                database.getOrAddCppFile("BarFile.cpp");

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("No equality with one file (wrong file name)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddCppFile("Foo.cpp");

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("No equality added header instead", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddHppFile("TestFile.cpp");

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("Check has cpp file after add", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_file_expected_db.json",
                        testData
                    );
                const fileName = "TestFile.cpp";
                database.getOrAddCppFile(fileName);
                assert.ok(database.hasCppFile(fileName));
                assert.ok(!database.hasHppFile(fileName));

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });

    suite("Add and remove second file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_file_expected_db.json",
                        testData
                    );
                const fileName = "TestFile.cpp";
                const additionalFileName = "Foo.cpp";
                database.getOrAddCppFile(fileName);
                database.getOrAddCppFile(additionalFileName);
                assert.ok(database.hasCppFile(fileName));
                assert.ok(database.hasCppFile(additionalFileName));

                database.writeDatabase();

                // Should not be equal until the second file was removed.
                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );

                database.removeCppFileAndDependingContent(additionalFileName);
                assert.ok(database.hasCppFile(fileName));
                assert.ok(!database.hasCppFile(additionalFileName));

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });
});
