import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";
import { AbstractDatabase } from "../../../../../../backend/database/impls/AbstractDatabase";
import { FuncSearchObject } from "../../../../../../backend/database/FuncSearchObject";
import { assertFuncEquals } from "../../../../helper/database_equality";

suite("Simple File With One Impl", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple test", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");

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
                    database.getFuncImplsOrOneDecl(funcSearchObject);

                assert.equal(foundMatches.length, 1);
                assertFuncEquals(foundMatches[0], func);
            });
        });
    });

    suite("Simple test no match because virtual was searched", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");

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
                    isVirtual: true,
                });

                const foundMatches =
                    database.getFuncImplsOrOneDecl(funcSearchObject);

                assert.equal(foundMatches.length, 0);
            });
        });
    });
});
