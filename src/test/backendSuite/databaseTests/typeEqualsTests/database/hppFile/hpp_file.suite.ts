import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { prepareDatabaseEqualityTests } from "../../database_equality_tests";
import {
    assertDatabaseEquals,
    assertHeaderFileEquals,
} from "../../../../helper/database_equality";

suite("Hpp File", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple equality with one file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_hpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddHppFile("TestFile.h");

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
                        "simple_hpp_file_expected_db.json",
                        testData
                    );
                const firstAdd = database.getOrAddHppFile("TestFile.h");
                const secondAdd = database.getOrAddHppFile("TestFile.h");
                assertHeaderFileEquals(firstAdd, secondAdd);

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
                        "multiple_simple_hpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddHppFile("TestFile.h");
                database.getOrAddHppFile("FooFile.h");
                database.getOrAddHppFile("BarFile.h");

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
                        "multiple_simple_hpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddHppFile("FooFile.h");
                database.getOrAddHppFile("BarFile.h");

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
                        "simple_hpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddHppFile("FooFile.h");
                database.getOrAddHppFile("BarFile.h");

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
                        "multiple_simple_hpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddHppFile("FooFile.h");
                database.getOrAddHppFile("FooFile2.h");
                database.getOrAddHppFile("BarFile.h");

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
                        "simple_hpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddHppFile("Foo.h");

                database.writeDatabase();

                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );
            });
        });
    });

    suite("No equality added cpp file instead", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_hpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddCppFile("TestFile.h");

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
                        "simple_hpp_file_expected_db.json",
                        testData
                    );
                const fileName = "TestFile.h";
                database.getOrAddHppFile(fileName);
                assert.ok(!database.hasCppFile(fileName));
                assert.ok(database.hasHppFile(fileName));

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
                        "simple_hpp_file_expected_db.json",
                        testData
                    );
                const fileName = "TestFile.h";
                const additionalFileName = "Foo.h";
                database.getOrAddHppFile(fileName);
                database.getOrAddHppFile(additionalFileName);
                assert.ok(database.hasHppFile(fileName));
                assert.ok(database.hasHppFile(additionalFileName));

                database.writeDatabase();

                // Should not be equal until the second file was removed.
                assert.throws(() =>
                    assertDatabaseEquals(database, referenceDatabase)
                );

                database.removeHppFileAndDependingContent(additionalFileName);
                assert.ok(database.hasHppFile(fileName));
                assert.ok(!database.hasHppFile(additionalFileName));

                database.writeDatabase();

                assertDatabaseEquals(database, referenceDatabase);
            });
        });
    });
});
