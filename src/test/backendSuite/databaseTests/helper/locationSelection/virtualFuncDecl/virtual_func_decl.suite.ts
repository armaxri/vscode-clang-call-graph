import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { createCleanLowdbDatabase } from "../../../../helper/database_helper";

suite("Virtual Func Decl", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("match location", () => {
        const database = createCleanLowdbDatabase(__dirname);
        const file = database.getOrAddCppFile("file.cpp");
        const cppClass = file.addClass("Foo");

        const func = cppClass.addVirtualFuncDecl({
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

        const func = cppClass.addVirtualFuncDecl({
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
});
