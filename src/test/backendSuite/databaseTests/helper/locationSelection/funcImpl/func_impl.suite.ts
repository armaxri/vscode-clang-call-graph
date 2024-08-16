import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { createCleanLowdbDatabase } from "../../../../helper/database_helper";
import { assertFuncEquals } from "../../../../helper/database_equality";

suite("Func Impl", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("match location", () => {
        const database = createCleanLowdbDatabase(__dirname);
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

        assert.ok(func.matchesLocation({ line: 2, column: 2 }));
        assert.ok(func.matchesLocation({ line: 2, column: 5 }));
        assert.ok(func.matchesLocation({ line: 2, column: 10 }));
    });

    test("no match location", () => {
        const database = createCleanLowdbDatabase(__dirname);
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

        assert.ok(!func.matchesLocation({ line: 1, column: 2 }));
        assert.ok(!func.matchesLocation({ line: 1, column: 5 }));
        assert.ok(!func.matchesLocation({ line: 1, column: 10 }));

        assert.ok(!func.matchesLocation({ line: 2, column: 1 }));
        assert.ok(!func.matchesLocation({ line: 2, column: 11 }));

        assert.ok(!func.matchesLocation({ line: 3, column: 2 }));
        assert.ok(!func.matchesLocation({ line: 3, column: 5 }));
        assert.ok(!func.matchesLocation({ line: 3, column: 10 }));
    });

    test("getMatchingFuncs self", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddCppFile("file.cpp");

        const func2call = file.addFuncDecl({
            funcName: "func2call",
            qualType: "int",
            range: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 10 },
            },
            funcAstName: "func2call",
        });
        const funcImpl = file.addFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 10 },
            },
        });
        const func = funcImpl.addFuncCall({
            func: func2call,
            range: {
                start: { line: 2, column: 2 },
                end: { line: 2, column: 10 },
            },
        });
        database.writeDatabase();

        const matches = funcImpl.getMatchingFuncs({ line: 3, column: 5 });

        assert.strictEqual(matches.length, 1);
        assertFuncEquals(matches[0], funcImpl);
    });

    test("getMatchingFuncs call", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddCppFile("file.cpp");

        const func2call = file.addFuncDecl({
            funcName: "func2call",
            qualType: "int",
            range: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 10 },
            },
            funcAstName: "func2call",
        });
        const funcImpl = file.addFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 10 },
            },
        });
        const func = funcImpl.addFuncCall({
            func: func2call,
            range: {
                start: { line: 2, column: 2 },
                end: { line: 2, column: 10 },
            },
        });
        database.writeDatabase();

        const matches = funcImpl.getMatchingFuncs({ line: 2, column: 5 });

        assert.strictEqual(matches.length, 1);
        assertFuncEquals(matches[0], func);
    });

    test("getMatchingFuncs no matches", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddCppFile("file.cpp");

        const func2call = file.addFuncDecl({
            funcName: "func2call",
            qualType: "int",
            range: {
                start: { line: 1, column: 2 },
                end: { line: 1, column: 10 },
            },
            funcAstName: "func2call",
        });
        const funcImpl = file.addFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 10 },
            },
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
            funcImpl.getMatchingFuncs({ line: 1, column: 5 }).length,
            0
        );
        assert.strictEqual(
            funcImpl.getMatchingFuncs({ line: 2, column: 11 }).length,
            0
        );
        assert.strictEqual(
            funcImpl.getMatchingFuncs({ line: 3, column: 1 }).length,
            0
        );
    });
});
