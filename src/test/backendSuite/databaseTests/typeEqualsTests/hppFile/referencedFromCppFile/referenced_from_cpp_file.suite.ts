import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { prepareDatabaseEqualityTests } from "../../database_equality_tests";

suite("Referenced from Cpp Files", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Equality with simple parent class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_referenced_from_cpp_file_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile("base.cpp");
                const hppFile = database.getOrAddHppFile("base.hpp");

                hppFile.addReferencedFromFile(cppFile.getName());

                database.writeDatabase();

                assert.strictEqual(hppFile.getReferencedFromFiles().length, 1);
                assert.strictEqual(
                    hppFile.getReferencedFromFiles()[0],
                    cppFile.getName()
                );

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    suite("Get or add with simple parent class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_referenced_from_cpp_file_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile("base.cpp");
                const hppFile = database.getOrAddHppFile("base.hpp");

                hppFile.addReferencedFromFile(cppFile.getName());
                hppFile.addReferencedFromFile(cppFile.getName());

                database.writeDatabase();

                assert.strictEqual(hppFile.getReferencedFromFiles().length, 1);
                assert.strictEqual(
                    hppFile.getReferencedFromFiles()[0],
                    cppFile.getName()
                );

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with simple parent class (missing connection)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_referenced_from_cpp_file_expected_db.json",
                        testData
                    );
                database.getOrAddCppFile("base.cpp");
                const hppFile = database.getOrAddHppFile("base.hpp");

                database.writeDatabase();

                assert.strictEqual(hppFile.getReferencedFromFiles().length, 0);

                assert.ok(!database.equals(referenceDatabase));
            });
        });
    });
});
