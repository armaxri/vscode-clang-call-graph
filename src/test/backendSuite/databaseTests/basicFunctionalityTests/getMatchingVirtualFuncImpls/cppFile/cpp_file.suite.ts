import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";
import { AbstractDatabase } from "../../../../../../backend/database/impls/AbstractDatabase";
import { FuncSearchObject } from "../../../../../../backend/database/FuncSearchObject";

suite("Cpp File", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple with one cpp file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");

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

    suite("Simple with one cpp file and one class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");
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

    suite("Simple with one cpp file and with class inside a class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");
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
        "Simple with one cpp file no match cause of non virtual function",
        () => {
            [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
                test(`${DatabaseType[testData]}`, () => {
                    const database = openNewDatabase(
                        __dirname,
                        testData
                    ) as AbstractDatabase;

                    const file = database.getOrAddCppFile("file.cpp");

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
});
