import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";
import { AbstractDatabase } from "../../../../../../backend/database/impls/AbstractDatabase";
import { FuncSearchObject } from "../../../../../../backend/database/FuncSearchObject";
import { assertFuncEquals } from "../../../../helper/database_equality";

suite("Cpp File", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Decl in file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

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

                const funcSearchObject = new FuncSearchObject({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                    file: file,
                });

                const foundMatch = file.findFuncDecl(funcSearchObject);

                assert.notEqual(foundMatch, null);
                assertFuncEquals(foundMatch!, func);
            });
        });
    });

    suite("Decl in class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");
                const classInst = file.addClass("class");

                const func = classInst.addFuncDecl({
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
                    file: file,
                });

                const foundMatch = file.findFuncDecl(funcSearchObject);

                assert.notEqual(foundMatch, null);
                assertFuncEquals(foundMatch!, func);
            });
        });
    });

    suite("Decl in inner class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");
                const outerClassInst = file.addClass("outerClass");
                const classInst = outerClassInst.addClass("class");

                const func = classInst.addFuncDecl({
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
                    file: file,
                });

                const foundMatch = file.findFuncDecl(funcSearchObject);

                assert.notEqual(foundMatch, null);
                assertFuncEquals(foundMatch!, func);
            });
        });
    });

    suite("Decl in header", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");
                const headerFile = database.getOrAddHppFile("header.h");
                headerFile.addReferencedFromFile(file.getName());

                const func = headerFile.addFuncDecl({
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
                    file: file,
                });

                const foundMatch = file.findFuncDecl(funcSearchObject);

                assert.notEqual(foundMatch, null);
                assertFuncEquals(foundMatch!, func);
            });
        });
    });

    suite("No decl match in inner class or header", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const file = database.getOrAddCppFile("file.cpp");
                const headerFile = database.getOrAddHppFile("header.h");
                const outerClassInst = file.addClass("outerClass");
                const classInst = outerClassInst.addClass("class");
                headerFile.addReferencedFromFile(file.getName());

                database.writeDatabase();

                const funcSearchObject = new FuncSearchObject({
                    funcName: "func",
                    funcAstName: "func",
                    qualType: "int",
                    file: file,
                });

                const foundMatch = file.findFuncDecl(funcSearchObject);

                assert.equal(foundMatch, null);
            });
        });
    });
});
