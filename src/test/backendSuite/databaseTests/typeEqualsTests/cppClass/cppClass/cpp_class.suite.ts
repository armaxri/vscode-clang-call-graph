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
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                const cppClass = await cppFile.getOrAddClass("BarClass");
                await cppClass.getOrAddClass("FooClass");

                await database.writeDatabase();

                assert.ok(await database.equals(referenceDatabase));
            });
        });
    });

    suite("Equality with multiple classes", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                const cppClass = await cppFile.getOrAddClass("BarClass");
                await cppClass.getOrAddClass("FooClassA");
                await cppClass.getOrAddClass("FooClassB");
                await cppClass.getOrAddClass("FooClassC");
                await cppClass.getOrAddClass("FooClassD");

                await database.writeDatabase();

                assert.ok(await database.equals(referenceDatabase));
            });
        });
    });

    suite("No equality with multiple classes (missing class)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                const cppClass = await cppFile.getOrAddClass("BarClass");
                await cppClass.getOrAddClass("FooClassA");
                await cppClass.getOrAddClass("FooClassB");
                await cppClass.getOrAddClass("FooClassD");

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });

    suite("No equality with multiple classes (wrong class name)", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                const cppClass = await cppFile.getOrAddClass("BarClass");
                await cppClass.getOrAddClass("FooClassX");
                await cppClass.getOrAddClass("FooClassB");
                await cppClass.getOrAddClass("FooClassC");
                await cppClass.getOrAddClass("FooClassD");

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });

    suite("No equality with wrong class name", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                const cppClass = await cppFile.getOrAddClass("BarClass");
                await cppClass.getOrAddClass("BarClass");

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });

    suite("No equality with added to wrong cpp file instead", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
            test(`${DatabaseType[testData]}`, async () => {
                const [database, referenceDatabase] =
                    await prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = await database.getOrAddCppFile(
                    "simple_cpp_class.json"
                );
                await cppFile.getOrAddClass("BarClass");

                await database.writeDatabase();

                assert.ok(!(await database.equals(referenceDatabase)));
            });
        });
    });
});
