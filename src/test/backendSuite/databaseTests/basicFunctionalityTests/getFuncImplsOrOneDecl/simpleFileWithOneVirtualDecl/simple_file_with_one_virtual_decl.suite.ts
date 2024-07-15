import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";
import { AbstractDatabase } from "../../../../../../backend/database/impls/AbstractDatabase";
import { FuncSearchObject } from "../../../../../../backend/database/FuncSearchObject";

suite("Simple File With One Virtual Decl", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple test", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");

                const simpleClass = file.addClass("SimpleClass");

                const func = simpleClass.addVirtualFuncDecl({
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
                    isVirtual: true,
                });

                const foundMatches =
                    database.getFuncImplsOrOneDecl(funcSearchObject);

                assert.equal(foundMatches.length, 1);
                assert.ok(foundMatches[0].equals(func));
            });
        });
    });

    suite("Simple test no match because no virtual was searched", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");

                const simpleClass = file.addClass("SimpleClass");

                const func = simpleClass.addVirtualFuncDecl({
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
                    funcAstName: "func",
                    qualType: "int",
                    isVirtual: false,
                });

                const foundMatches =
                    database.getFuncImplsOrOneDecl(funcSearchObject);

                assert.equal(foundMatches.length, 0);
            });
        });
    });
});
