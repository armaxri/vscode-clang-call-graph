import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";
import { AbstractDatabase } from "../../../../../../backend/database/impls/AbstractDatabase";
import { FuncSearchObject } from "../../../../../../backend/database/FuncSearchObject";

suite("Hpp File", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple with one hpp file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddHppFile("file.h");

                const func = file.addFuncImpl({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcSearchObject = new FuncSearchObject({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                });

                const foundMatches =
                    database.getMatchingFuncImpls(funcSearchObject);

                assert.equal(foundMatches.length, 1);
                assert.ok(foundMatches[0].equals(func));
            });
        });
    });

    suite("Simple with one hpp file and one class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddHppFile("file.h");
                const classInst = file.addClass("class");

                const func = classInst.addFuncImpl({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcSearchObject = new FuncSearchObject({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                });

                const foundMatches =
                    database.getMatchingFuncImpls(funcSearchObject);

                assert.equal(foundMatches.length, 1);
                assert.ok(foundMatches[0].equals(func));
            });
        });
    });

    suite("Simple with one hpp file with one class within one class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddHppFile("file.h");
                const parentClassInst = file.addClass("parentClass");
                const classInst = parentClassInst.addClass("class");

                const func = classInst.addFuncImpl({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcSearchObject = new FuncSearchObject({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                });

                const foundMatches =
                    database.getMatchingFuncImpls(funcSearchObject);

                assert.equal(foundMatches.length, 1);
                assert.ok(foundMatches[0].equals(func));
            });
        });
    });
});
