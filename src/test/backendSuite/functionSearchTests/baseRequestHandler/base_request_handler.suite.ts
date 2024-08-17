import assert from "assert";
import { FuncBasics } from "../../../../backend/database/cpp_structure";
import { BaseRequestHandler } from "../../../../backend/functionSearch/BaseRequestHandler";
import { CancellationToken } from "../../../../backend/functionSearch/CancellationToken";
import { createCleanLowdbDatabase } from "../../helper/database_helper";
import { addSuitesInSubDirsSuites } from "../../helper/mocha_test_helper";
import { MockConfig } from "../../helper/MockConfig";
import { MockUserInterface } from "../../helper/MockUserInterface";
import { assertFuncEquals } from "../../helper/database_equality";

function mainTestSetup(): [BaseRequestHandler, FuncBasics] {
    const config = new MockConfig(__dirname);
    const database = createCleanLowdbDatabase(__dirname);
    const userInterface = new MockUserInterface();

    const handler = new BaseRequestHandler(config, database, userInterface);

    const file = database.getOrAddCppFile("test.cpp");
    const decl = file.addFuncDecl({
        funcAstName: "test",
        funcName: "test",
        qualType: "void",
        range: {
            start: { line: 2, column: 1 },
            end: { line: 2, column: 10 },
        },
    });

    database.writeDatabase();

    return [handler, decl];
}

suite("Base Request Handler", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("Basic decl match", () => {
        const [handler, decl] = mainTestSetup();

        const treeItem = handler.getTreeItem(
            "test.cpp",
            { line: 2, column: 5 },
            new CancellationToken()
        );

        assert.notEqual(treeItem, null);
        assert.equal(treeItem?.isMethod(), false);
        assertFuncEquals(treeItem!.getFunc(), decl);
        assert.equal(treeItem?.getFile().getName(), "test.cpp");
    });

    test("Basic decl mismatch on location", () => {
        const [handler, decl] = mainTestSetup();

        const treeItem = handler.getTreeItem(
            "test.cpp",
            { line: 1, column: 5 },
            new CancellationToken()
        );

        assert.equal(treeItem, null);
    });

    test("Basic decl mismatch no file", () => {
        const [handler, decl] = mainTestSetup();

        const treeItem = handler.getTreeItem(
            "test2.cpp",
            { line: 1, column: 5 },
            new CancellationToken()
        );

        assert.equal(treeItem, null);
    });

    test("Basic decl match in header", () => {
        const config = new MockConfig(__dirname);
        const database = createCleanLowdbDatabase(__dirname);
        const userInterface = new MockUserInterface();

        const handler = new BaseRequestHandler(config, database, userInterface);

        const file = database.getOrAddHppFile("test.h");
        const decl = file.addFuncDecl({
            funcAstName: "test",
            funcName: "test",
            qualType: "void",
            range: {
                start: { line: 2, column: 1 },
                end: { line: 2, column: 10 },
            },
        });

        database.writeDatabase();

        const treeItem = handler.getTreeItem(
            "test.h",
            { line: 2, column: 5 },
            new CancellationToken()
        );

        assert.notEqual(treeItem, null);
        assert.equal(treeItem?.isMethod(), false);
        assertFuncEquals(treeItem!.getFunc(), decl);
        assert.equal(treeItem?.getFile().getName(), "test.h");
    });
});
