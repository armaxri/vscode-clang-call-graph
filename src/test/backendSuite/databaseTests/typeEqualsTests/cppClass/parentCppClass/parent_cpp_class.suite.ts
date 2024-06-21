import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import {
    getEmptyReferenceDatabase,
    openDatabase,
    prepareDatabaseEqualityTests,
} from "../../database_equality_tests";

suite("Parent Cpp Class", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Equality with simple parent class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_parent_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_parent_cpp_class.json"
                );
                const parentClass = cppFile.addClass("ParentClass");
                const childClass = cppFile.addClass("ChildClass");

                childClass.addParentClass(parentClass);

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    suite("Equality with multiple simple parent class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "multiple_simple_parent_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "multiple_simple_parent_cpp_class.json"
                );
                const parentClass1 = cppFile.addClass("ParentClass1");
                const parentClass2 = cppFile.addClass("ParentClass2");
                const parentClass3 = cppFile.addClass("ParentClass3");
                const parentClass4 = cppFile.addClass("ParentClass4");
                const childClass = cppFile.addClass("ChildClass");

                childClass.addParentClass(parentClass1);
                childClass.addParentClass(parentClass2);
                childClass.addParentClass(parentClass3);
                childClass.addParentClass(parentClass4);

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    suite(
        "No equality with multiple simple parent class (missing parent)",
        () => {
            [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
                test(`${DatabaseType[testData]}`, () => {
                    const [database, referenceDatabase] =
                        prepareDatabaseEqualityTests(
                            __dirname,
                            "multiple_simple_parent_cpp_class_expected_db.json",
                            testData
                        );
                    const cppFile = database.getOrAddCppFile(
                        "multiple_simple_parent_cpp_class.json"
                    );
                    const parentClass1 = cppFile.addClass("ParentClass1");
                    const parentClass2 = cppFile.addClass("ParentClass2");
                    cppFile.addClass("ParentClass3");
                    const parentClass4 = cppFile.addClass("ParentClass4");
                    const childClass = cppFile.addClass("ChildClass");

                    childClass.addParentClass(parentClass1);
                    childClass.addParentClass(parentClass2);
                    childClass.addParentClass(parentClass4);

                    database.writeDatabase();

                    assert.ok(!database.equals(referenceDatabase));
                });
            });
        }
    );

    suite("Equality with multiple chained parent class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "parent_cpp_class_chain_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "parent_cpp_class_chain.json"
                );
                const grandParentClass = cppFile.addClass("GrandParentClass");
                const parentClass = cppFile.addClass("ParentClass");
                parentClass.addParentClass(grandParentClass);
                const childClass = cppFile.addClass("ChildClass");
                childClass.addParentClass(parentClass);

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    suite(
        "No equality with multiple chained parent class (missing middle class)",
        () => {
            [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
                test(`${DatabaseType[testData]}`, () => {
                    const [database, referenceDatabase] =
                        prepareDatabaseEqualityTests(
                            __dirname,
                            "parent_cpp_class_chain_expected_db.json",
                            testData
                        );
                    const cppFile = database.getOrAddCppFile(
                        "parent_cpp_class_chain.json"
                    );
                    const grandParentClass =
                        cppFile.addClass("GrandParentClass");
                    const parentClass = cppFile.addClass("ParentClass");
                    parentClass.addParentClass(grandParentClass);
                    const childClass = cppFile.addClass("ChildClass");
                    childClass.addParentClass(grandParentClass);

                    database.writeDatabase();

                    assert.ok(!database.equals(referenceDatabase));
                });
            });
        }
    );

    suite("Get parent classes", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_parent_cpp_class_expected_db.json",
                    testData
                )[0];
                const cppFile = database.getOrAddCppFile(
                    "simple_parent_cpp_class.json"
                );
                const parentClass = cppFile.addClass("ParentClass");
                const childClass = cppFile.addClass("ChildClass");
                childClass.addParentClass(parentClass);

                const parentClasses = childClass.getParentClasses();

                assert.strictEqual(parentClasses.length, 1);
                assert.ok(parentClasses[0].equals(parentClass));
            });
        });
    });

    suite("Reopen database before comparison", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "parent_cpp_class_chain_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "parent_cpp_class_chain.json"
                );
                const grandParentClass = cppFile.addClass("GrandParentClass");
                const parentClass = cppFile.addClass("ParentClass");
                parentClass.addParentClass(grandParentClass);
                const childClass = cppFile.addClass("ChildClass");
                childClass.addParentClass(parentClass);

                database.writeDatabase();

                const newDatabase = openDatabase(__dirname, testData);

                assert.ok(newDatabase.equals(referenceDatabase));
            });
        });
    });

    suite("Equality with simple parent class in different files", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "parent_cpp_class_in_hpp_expected_db.json",
                        testData
                    );
                const hppFile = database.getOrAddHppFile("ParentClass.h");
                const parentClass = hppFile.addClass("ParentClass");
                const cppFile = database.getOrAddCppFile("ChildClass.cpp");
                const childClass = cppFile.addClass("ChildClass");

                childClass.addParentClass(parentClass);

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));
            });
        });
    });

    /*
    TODO:
    suite("Removed all database content", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach( (testData) => {
            test(`${DatabaseType[testData]}`,  () => {
                const [database, referenceDatabase] =
                    prepareDatabaseEqualityTests(
                        __dirname,
                        "simple_parent_cpp_class_expected_db.json",
                        testData
                    );
                const cppFile = database.getOrAddCppFile(
                    "simple_parent_cpp_class.json"
                );
                const parentClass = cppFile.addClass("ParentClass");
                const childClass = cppFile.addClass("ChildClass");

                childClass.addParentClass(parentClass);

                database.writeDatabase();

                assert.ok(database.equals(referenceDatabase));

                database.removeCppFileAndDependingContent(cppFile.getName());
                database.writeDatabase();
                assert.ok(database.equals(getEmptyReferenceDatabase()));
            });
        });
    });
    */
});
