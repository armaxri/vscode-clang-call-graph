import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { createCleanLowdbDatabase } from "../../../../helper/database_helper";

suite("Virtual Func Call", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("match location", () => {
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
        const funcImpl = file.addFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 10 },
            },
        });
        const func = funcImpl.addVirtualFuncCall({
            func: func2call,
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
        const funcImpl = file.addFuncImpl({
            funcName: "func",
            funcAstName: "func",
            qualType: "int",
            range: {
                start: { line: 3, column: 2 },
                end: { line: 3, column: 10 },
            },
        });
        const func = funcImpl.addVirtualFuncCall({
            func: func2call,
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
});
