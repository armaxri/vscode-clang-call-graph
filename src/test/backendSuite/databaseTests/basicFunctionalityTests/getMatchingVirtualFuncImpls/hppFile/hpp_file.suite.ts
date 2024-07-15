import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";
import { AbstractDatabase } from "../../../../../../backend/database/impls/AbstractDatabase";
import { FuncSearchObject } from "../../../../../../backend/database/FuncSearchObject";

suite("Hpp File", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple with one header file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddHppFile("file.h");

                const func = file.addVirtualFuncImpl({
                    funcName: "func",
                    funcAstName: "funcBase",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                    baseFuncAstName: "funcBase",
                });

                database.writeDatabase();

                const funcSearchObject = new FuncSearchObject({
                    funcName: "func",
                    baseFuncAstName: "funcBase",
                    qualType: "int",
                });

                const foundMatches =
                    database.getMatchingVirtualFuncImpls(funcSearchObject);

                assert.equal(foundMatches.length, 1);
                assert.ok(foundMatches[0].equals(func));
            });
        });
    });

    suite("Simple with one header file and one class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddHppFile("file.h");
                const classInst = file.addClass("class");

                const func = classInst.addVirtualFuncImpl({
                    funcName: "func",
                    funcAstName: "funcBase",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                    baseFuncAstName: "funcBase",
                });

                database.writeDatabase();

                const funcSearchObject = new FuncSearchObject({
                    funcName: "func",
                    baseFuncAstName: "funcBase",
                    qualType: "int",
                });

                const foundMatches =
                    database.getMatchingVirtualFuncImpls(funcSearchObject);

                assert.equal(foundMatches.length, 1);
                assert.ok(foundMatches[0].equals(func));
            });
        });
    });

    suite("Simple with one header file and with class inside a class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddHppFile("file.h");
                const parentClassInst = file.addClass("parentClass");
                const classInst = parentClassInst.addClass("class");

                const func = classInst.addVirtualFuncImpl({
                    funcName: "func",
                    funcAstName: "funcBase",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                    baseFuncAstName: "funcBase",
                });

                database.writeDatabase();

                const funcSearchObject = new FuncSearchObject({
                    funcName: "func",
                    baseFuncAstName: "funcBase",
                    qualType: "int",
                });

                const foundMatches =
                    database.getMatchingVirtualFuncImpls(funcSearchObject);

                assert.equal(foundMatches.length, 1);
                assert.ok(foundMatches[0].equals(func));
            });
        });
    });

    suite(
        "Simple with one hpp file no match cause of non virtual function",
        () => {
            [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
                test(`${DatabaseType[testData]}`, () => {
                    const database = openNewDatabase(
                        __dirname,
                        testData
                    ) as AbstractDatabase;

                    const file = database.getOrAddHppFile("file.h");

                    const func = file.addFuncImpl({
                        funcName: "func",
                        funcAstName: "funcBase",
                        qualType: "int",
                        range: {
                            start: { line: 2, column: 2 },
                            end: { line: 2, column: 10 },
                        },
                    });

                    database.writeDatabase();

                    const funcSearchObject = new FuncSearchObject({
                        funcName: "func",
                        baseFuncAstName: "funcBase",
                        qualType: "int",
                    });

                    const foundMatches =
                        database.getMatchingVirtualFuncImpls(funcSearchObject);

                    assert.equal(foundMatches.length, 0);
                });
            });
        }
    );

    suite("Simple with two hpp files and two implementations", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file1 = database.getOrAddHppFile("file1.h");

                const func1 = file1.addVirtualFuncImpl({
                    funcName: "func",
                    funcAstName: "funcBase",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                    baseFuncAstName: "funcBase",
                });

                const file2 = database.getOrAddHppFile("file2.h");

                const func2 = file2.addVirtualFuncImpl({
                    funcName: "func",
                    funcAstName: "funcDerived",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                    baseFuncAstName: "funcBase",
                });

                database.writeDatabase();

                const funcSearchObject = new FuncSearchObject({
                    funcName: "func",
                    baseFuncAstName: "funcBase",
                    qualType: "int",
                });

                const foundMatches =
                    database.getMatchingVirtualFuncImpls(funcSearchObject);

                assert.equal(foundMatches.length, 2);
                if (foundMatches[0].equals(func1)) {
                    assert.ok(foundMatches[0].equals(func1));
                    assert.ok(foundMatches[1].equals(func2));
                } else {
                    assert.ok(foundMatches[0].equals(func2));
                    assert.ok(foundMatches[1].equals(func1));
                }
            });
        });
    });
});
