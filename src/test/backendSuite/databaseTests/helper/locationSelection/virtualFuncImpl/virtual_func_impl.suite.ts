import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { createCleanLowdbDatabase } from "../../../../helper/database_helper";

suite("Virtual Func Impl", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("match location", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddCppFile("file.cpp");
        const cppClass = file.addClass("Foo");

        const func = cppClass.addVirtualFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 2, column: 2 },
                end: { line: 2, column: 10 },
            },
            baseFuncAstName: "func",
        });
        database.writeDatabase();

        assert.ok(func.matchesLocation({ line: 2, column: 2 }));
        assert.ok(func.matchesLocation({ line: 2, column: 5 }));
        assert.ok(func.matchesLocation({ line: 2, column: 10 }));
    });

    test("no match location", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddCppFile("file.cpp");
        const cppClass = file.addClass("Foo");

        const func = cppClass.addVirtualFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 2, column: 2 },
                end: { line: 2, column: 10 },
            },
            baseFuncAstName: "func",
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

        const matches = funcImpl.getMatchingFuncs({ line: 3, column: 5 });

        assert.strictEqual(matches.length, 1);
        assert.ok(matches[0].equals(funcImpl));
    });

    test("getMatchingFuncs call", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddCppFile("file.cpp");
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

        const matches = funcImpl.getMatchingFuncs({ line: 2, column: 5 });

        assert.strictEqual(matches.length, 1);
        assert.ok(matches[0].equals(func));
    });

    test("getMatchingFuncs no matches", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddCppFile("file.cpp");
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
