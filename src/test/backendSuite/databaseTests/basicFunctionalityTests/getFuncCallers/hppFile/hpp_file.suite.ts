import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";

suite("Hpp File", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple func call from impl", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");

                const funcDecl = file.addFuncDecl({
                    funcName: "foo",
                    funcAstName: "foo",
                    qualType: "int",
                    range: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 10 },
                    },
                });

                const funcImpl = file.addFuncImpl({
                    funcName: "bar",
                    funcAstName: "bar",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                funcImpl.addFuncCall({
                    func: funcDecl,
                    range: {
                        start: { line: 3, column: 1 },
                        end: { line: 3, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcImpls = database.getFuncCallers(funcDecl);

                assert.equal(funcImpls.length, 1);
                assert.ok(funcImpls[0].equals(funcImpl));
            });
        });
    });

    suite("Simple func call from impl in class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");
                const classInst = file.addClass("class");

                const funcDecl = file.addFuncDecl({
                    funcName: "foo",
                    funcAstName: "foo",
                    qualType: "int",
                    range: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 10 },
                    },
                });

                const funcImpl = classInst.addFuncImpl({
                    funcName: "bar",
                    funcAstName: "bar",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                funcImpl.addFuncCall({
                    func: funcDecl,
                    range: {
                        start: { line: 3, column: 1 },
                        end: { line: 3, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcImpls = database.getFuncCallers(funcDecl);

                assert.equal(funcImpls.length, 1);
                assert.ok(funcImpls[0].equals(funcImpl));
            });
        });
    });

    suite("Simple func call from impl in inner class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");
                const outerClass = file.addClass("outerClass");
                const classInst = outerClass.addClass("class");

                const funcDecl = file.addFuncDecl({
                    funcName: "foo",
                    funcAstName: "foo",
                    qualType: "int",
                    range: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 10 },
                    },
                });

                const funcImpl = classInst.addFuncImpl({
                    funcName: "bar",
                    funcAstName: "bar",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                funcImpl.addFuncCall({
                    func: funcDecl,
                    range: {
                        start: { line: 3, column: 1 },
                        end: { line: 3, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcImpls = database.getFuncCallers(funcDecl);

                assert.equal(funcImpls.length, 1);
                assert.ok(funcImpls[0].equals(funcImpl));
            });
        });
    });

    suite("Simple func call from virtual impl", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");

                const funcDecl = file.addFuncDecl({
                    funcName: "foo",
                    funcAstName: "foo",
                    qualType: "int",
                    range: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 10 },
                    },
                });

                const funcImpl = file.addVirtualFuncImpl({
                    funcName: "bar",
                    funcAstName: "bar",
                    baseFuncAstName: "bar",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                funcImpl.addFuncCall({
                    func: funcDecl,
                    range: {
                        start: { line: 3, column: 1 },
                        end: { line: 3, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcImpls = database.getFuncCallers(funcDecl);

                assert.equal(funcImpls.length, 1);
                assert.ok(funcImpls[0].equals(funcImpl));
            });
        });
    });

    suite("Simple func call from virtual impl in class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");
                const classInst = file.addClass("class");

                const funcDecl = file.addFuncDecl({
                    funcName: "foo",
                    funcAstName: "foo",
                    qualType: "int",
                    range: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 10 },
                    },
                });

                const funcImpl = classInst.addVirtualFuncImpl({
                    funcName: "bar",
                    funcAstName: "bar",
                    baseFuncAstName: "bar",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                funcImpl.addFuncCall({
                    func: funcDecl,
                    range: {
                        start: { line: 3, column: 1 },
                        end: { line: 3, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcImpls = database.getFuncCallers(funcDecl);

                assert.equal(funcImpls.length, 1);
                assert.ok(funcImpls[0].equals(funcImpl));
            });
        });
    });

    suite("Simple virtual func call from impl", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");
                const declClass = file.addClass("declClass");

                const funcDecl = declClass.addVirtualFuncDecl({
                    funcName: "foo",
                    funcAstName: "foo",
                    baseFuncAstName: "foo",
                    qualType: "int",
                    range: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 10 },
                    },
                });

                const funcImpl = file.addFuncImpl({
                    funcName: "bar",
                    funcAstName: "bar",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                funcImpl.addVirtualFuncCall({
                    func: funcDecl,
                    range: {
                        start: { line: 3, column: 1 },
                        end: { line: 3, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcImpls = database.getFuncCallers(funcDecl);

                assert.equal(funcImpls.length, 1);
                assert.ok(funcImpls[0].equals(funcImpl));
            });
        });
    });

    suite("Simple virtual func call from impl in class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");
                const classInst = file.addClass("class");
                const declClass = file.addClass("declClass");

                const funcDecl = declClass.addVirtualFuncDecl({
                    funcName: "foo",
                    funcAstName: "foo",
                    baseFuncAstName: "foo",
                    qualType: "int",
                    range: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 10 },
                    },
                });

                const funcImpl = classInst.addFuncImpl({
                    funcName: "bar",
                    funcAstName: "bar",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                funcImpl.addVirtualFuncCall({
                    func: funcDecl,
                    range: {
                        start: { line: 3, column: 1 },
                        end: { line: 3, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcImpls = database.getFuncCallers(funcDecl);

                assert.equal(funcImpls.length, 1);
                assert.ok(funcImpls[0].equals(funcImpl));
            });
        });
    });

    suite("Simple virtual func call from virtual impl", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");
                const declClass = file.addClass("declClass");

                const funcDecl = declClass.addVirtualFuncDecl({
                    funcName: "foo",
                    funcAstName: "foo",
                    baseFuncAstName: "foo",
                    qualType: "int",
                    range: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 10 },
                    },
                });

                const funcImpl = file.addVirtualFuncImpl({
                    funcName: "bar",
                    funcAstName: "bar",
                    baseFuncAstName: "bar",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                funcImpl.addVirtualFuncCall({
                    func: funcDecl,
                    range: {
                        start: { line: 3, column: 1 },
                        end: { line: 3, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcImpls = database.getFuncCallers(funcDecl);

                assert.equal(funcImpls.length, 1);
                assert.ok(funcImpls[0].equals(funcImpl));
            });
        });
    });

    suite("Simple virtual func call from virtual impl in class", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");
                const classInst = file.addClass("class");
                const declClass = file.addClass("declClass");

                const funcDecl = declClass.addVirtualFuncDecl({
                    funcName: "foo",
                    funcAstName: "foo",
                    baseFuncAstName: "foo",
                    qualType: "int",
                    range: {
                        start: { line: 1, column: 1 },
                        end: { line: 1, column: 10 },
                    },
                });

                const funcImpl = classInst.addVirtualFuncImpl({
                    funcName: "bar",
                    funcAstName: "bar",
                    baseFuncAstName: "bar",
                    qualType: "int",
                    range: {
                        start: { line: 2, column: 2 },
                        end: { line: 2, column: 10 },
                    },
                });

                funcImpl.addVirtualFuncCall({
                    func: funcDecl,
                    range: {
                        start: { line: 3, column: 1 },
                        end: { line: 3, column: 10 },
                    },
                });

                database.writeDatabase();

                const funcImpls = database.getFuncCallers(funcDecl);

                assert.equal(funcImpls.length, 1);
                assert.ok(funcImpls[0].equals(funcImpl));
            });
        });
    });
});
