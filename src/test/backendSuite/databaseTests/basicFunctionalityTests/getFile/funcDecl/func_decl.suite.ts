import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";

suite("Func Decl", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple with one cpp file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddCppFile("file.cpp");

                const func = file.addFuncDecl({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });
                database.writeDatabase();

                assert.notEqual(func.getFile(), null);
                assert.equal(func.getFile()?.getName(), file.getName());
            });
        });
    });

    suite("Simple with one hpp file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");

                const func = file.addFuncDecl({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });
                database.writeDatabase();

                assert.notEqual(func.getFile(), null);
                assert.equal(func.getFile()?.getName(), file.getName());
            });
        });
    });

    suite("Simple with one cpp file nested in class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddCppFile("file.cpp");
                const cppClass = file.getOrAddClass("foo");

                const func = cppClass.addFuncDecl({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });
                database.writeDatabase();

                assert.notEqual(func.getFile(), null);
                assert.equal(func.getFile()?.getName(), file.getName());
            });
        });
    });

    suite("Simple with one hpp file nested in class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");
                const cppClass = file.getOrAddClass("foo");

                const func = cppClass.addFuncDecl({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });
                database.writeDatabase();

                assert.notEqual(func.getFile(), null);
                assert.equal(func.getFile()?.getName(), file.getName());
            });
        });
    });

    suite(
        "Simple with one cpp file nested in class within nested class",
        () => {
            [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
                test(`${DatabaseType[testData]}`, () => {
                    const database = openNewDatabase(__dirname, testData);

                    const file = database.getOrAddCppFile("file.cpp");
                    const baseCppClass = file.getOrAddClass("foo");
                    const cppClass = baseCppClass.getOrAddClass("bar");

                    const func = cppClass.addFuncDecl({
                        funcName: "func",
                        funcAstName: "func",
                        qualType: "int",
                        range: {
                            start: { line: 2, column: 2 },
                            end: { line: 2, column: 10 },
                        },
                    });
                    database.writeDatabase();

                    assert.notEqual(func.getFile(), null);
                    assert.equal(func.getFile()?.getName(), file.getName());
                });
            });
        }
    );

    suite(
        "Simple with one hpp file nested in class within nested class",
        () => {
            [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
                test(`${DatabaseType[testData]}`, () => {
                    const database = openNewDatabase(__dirname, testData);

                    const file = database.getOrAddHppFile("file.h");
                    const baseCppClass = file.getOrAddClass("foo");
                    const cppClass = baseCppClass.getOrAddClass("bar");

                    const func = cppClass.addFuncDecl({
                        funcName: "func",
                        funcAstName: "func",
                        qualType: "int",
                        range: {
                            start: { line: 2, column: 2 },
                            end: { line: 2, column: 10 },
                        },
                    });
                    database.writeDatabase();

                    assert.notEqual(func.getFile(), null);
                    assert.equal(func.getFile()?.getName(), file.getName());
                });
            });
        }
    );
});
