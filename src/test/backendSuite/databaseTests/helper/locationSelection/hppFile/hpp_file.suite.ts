import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { createCleanLowdbDatabase } from "../../../../helper/database_helper";
import { assertFuncEquals } from "../../../../helper/database_equality";

suite("Hpp File", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("getMatchingFuncs call", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddHppFile("file.h");
        const cppClass = file.addClass("Foo");

        const func2call = cppClass.addVirtualFuncDecl({
            funcName: "func2call",
            funcAstName: "func2call",
            qualType: "int",
            range: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 10 },
            },
            baseFuncAstName: "func2call",
        });
        const funcImpl = cppClass.addVirtualFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 10 },
            },
            baseFuncAstName: "func",
        });
        const func = funcImpl.addVirtualFuncCall({
            func: func2call,
            range: {
                start: { line: 2, column: 2 },
                end: { line: 2, column: 10 },
            },
        });
        database.writeDatabase();

        const matches = file.getMatchingFuncs({ line: 2, column: 5 });

        assert.strictEqual(matches.length, 1);
        assertFuncEquals(matches[0], func);
    });

    test("getMatchingFuncs virtual func decl", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddHppFile("file.h");
        const cppClass = file.addClass("Foo");

        const func2call = cppClass.addVirtualFuncDecl({
            funcName: "func2call",
            funcAstName: "func2call",
            qualType: "int",
            range: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 10 },
            },
            baseFuncAstName: "func2call",
        });
        const funcImpl = cppClass.addVirtualFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 10 },
            },
            baseFuncAstName: "func",
        });
        const func = funcImpl.addVirtualFuncCall({
            func: func2call,
            range: {
                start: { line: 2, column: 2 },
                end: { line: 2, column: 10 },
            },
        });
        database.writeDatabase();

        const matches = file.getMatchingFuncs({ line: 1, column: 5 });

        assert.strictEqual(matches.length, 1);
        assertFuncEquals(matches[0], func2call);
    });

    test("getMatchingFuncs virtual func impl", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddHppFile("file.h");
        const cppClass = file.addClass("Foo");

        const func2call = cppClass.addVirtualFuncDecl({
            funcName: "func2call",
            funcAstName: "func2call",
            qualType: "int",
            range: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 10 },
            },
            baseFuncAstName: "func2call",
        });
        const funcImpl = cppClass.addVirtualFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 10 },
            },
            baseFuncAstName: "func",
        });
        const func = funcImpl.addVirtualFuncCall({
            func: func2call,
            range: {
                start: { line: 2, column: 2 },
                end: { line: 2, column: 10 },
            },
        });
        database.writeDatabase();

        const matches = file.getMatchingFuncs({ line: 3, column: 5 });

        assert.strictEqual(matches.length, 1);
        assertFuncEquals(matches[0], funcImpl);
    });

    test("getMatchingFuncs no matches", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddHppFile("file.h");
        const cppClass = file.addClass("Foo");

        const func2call = file.addFuncDecl({
            funcName: "func2call",
            funcAstName: "func2call",
            qualType: "int",
            range: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 10 },
            },
        });
        const funcImpl = cppClass.addVirtualFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 10 },
            },
            baseFuncAstName: "func",
        });
        const func = funcImpl.addFuncCall({
            func: func2call,
            range: {
                start: { line: 2, column: 2 },
                end: { line: 2, column: 10 },
            },
        });
        database.writeDatabase();

        assert.strictEqual(
            file.getMatchingFuncs({ line: 1, column: 15 }).length,
            0
        );
        assert.strictEqual(
            file.getMatchingFuncs({ line: 2, column: 11 }).length,
            0
        );
        assert.strictEqual(
            file.getMatchingFuncs({ line: 3, column: 1 }).length,
            0
        );
    });
});
