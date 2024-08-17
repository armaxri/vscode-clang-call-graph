import assert from "assert";
import { CancellationToken } from "../../../../../backend/functionSearch/CancellationToken";
import { createCleanLowdbDatabase } from "../../../helper/database_helper";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import { MockConfig } from "../../../helper/MockConfig";
import { TreeItem } from "../../../../../backend/functionSearch/TreeItem";
import { FuncBasics } from "../../../../../backend/database/cpp_structure";
import { Config } from "../../../../../backend/Config";
import { Database } from "../../../../../backend/database/Database";
import { assertFuncEquals } from "../../../helper/database_equality";

function setUpNonVirtualFunctionsTest(): [
    Config,
    Database,
    FuncBasics,
    FuncBasics,
    FuncBasics,
    FuncBasics
] {
    const config = new MockConfig(__dirname);
    const database = createCleanLowdbDatabase(__dirname);

    const file = database.getOrAddCppFile("test.cpp");
    const addDecl = file.addFuncDecl({
        funcAstName: "add",
        funcName: "add",
        qualType: "void",
        range: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 10 },
        },
    });
    const subImpl = file.addFuncImpl({
        funcAstName: "sub",
        funcName: "sub",
        qualType: "void",
        range: {
            start: { line: 2, column: 1 },
            end: { line: 2, column: 10 },
        },
    });
    const testImpl1 = file.addFuncImpl({
        funcAstName: "test1",
        funcName: "test1",
        qualType: "void",
        range: {
            start: { line: 3, column: 1 },
            end: { line: 3, column: 10 },
        },
    });
    testImpl1.addFuncCall({
        func: addDecl,
        range: {
            start: { line: 4, column: 1 },
            end: { line: 4, column: 10 },
        },
    });
    testImpl1.addFuncCall({
        func: subImpl,
        range: {
            start: { line: 5, column: 1 },
            end: { line: 5, column: 10 },
        },
    });
    const testImpl2 = file.addFuncImpl({
        funcAstName: "test2",
        funcName: "test2",
        qualType: "void",
        range: {
            start: { line: 6, column: 1 },
            end: { line: 6, column: 10 },
        },
    });
    testImpl2.addFuncCall({
        func: subImpl,
        range: {
            start: { line: 7, column: 1 },
            end: { line: 7, column: 10 },
        },
    });

    database.writeDatabase();

    return [config, database, addDecl, subImpl, testImpl1, testImpl2];
}

function setUpVirtualFunctionsTest(): [
    Config,
    Database,
    FuncBasics,
    FuncBasics,
    FuncBasics,
    FuncBasics,
    FuncBasics,
    FuncBasics
] {
    const config = new MockConfig(__dirname);
    const database = createCleanLowdbDatabase(__dirname);

    const file = database.getOrAddCppFile("test.cpp");
    const baseClass = file.addClass("BaseClass");
    const childClass = file.addClass("ChildClass");
    childClass.addParentClass(baseClass);
    const baseClassAddDecl = baseClass.addVirtualFuncDecl({
        funcAstName: "baseClass_add",
        funcName: "add",
        baseFuncAstName: "add",
        qualType: "void",
        range: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 10 },
        },
    });
    const baseClassSubImpl = baseClass.addVirtualFuncImpl({
        funcAstName: "baseClass_sub",
        funcName: "sub",
        baseFuncAstName: "sub",
        qualType: "void",
        range: {
            start: { line: 2, column: 1 },
            end: { line: 2, column: 10 },
        },
    });
    const childClassAddImpl = childClass.addVirtualFuncImpl({
        funcAstName: "childClass_add",
        funcName: "add",
        baseFuncAstName: "add",
        qualType: "void",
        range: {
            start: { line: 3, column: 1 },
            end: { line: 3, column: 10 },
        },
    });
    const childClassSubImpl = childClass.addVirtualFuncImpl({
        funcAstName: "childClass_sub",
        funcName: "sub",
        baseFuncAstName: "sub",
        qualType: "void",
        range: {
            start: { line: 4, column: 1 },
            end: { line: 4, column: 10 },
        },
    });

    const testImpl1 = file.addFuncImpl({
        funcAstName: "test1",
        funcName: "test1",
        qualType: "void",
        range: {
            start: { line: 5, column: 1 },
            end: { line: 5, column: 10 },
        },
    });
    testImpl1.addVirtualFuncCall({
        func: baseClassAddDecl,
        range: {
            start: { line: 6, column: 1 },
            end: { line: 6, column: 10 },
        },
    });
    testImpl1.addVirtualFuncCall({
        func: childClassSubImpl,
        range: {
            start: { line: 7, column: 1 },
            end: { line: 7, column: 10 },
        },
    });

    const testImpl2 = file.addFuncImpl({
        funcAstName: "test2",
        funcName: "test2",
        qualType: "void",
        range: {
            start: { line: 8, column: 1 },
            end: { line: 8, column: 10 },
        },
    });
    testImpl2.addVirtualFuncCall({
        func: childClassAddImpl,
        range: {
            start: { line: 9, column: 1 },
            end: { line: 9, column: 10 },
        },
    });
    testImpl2.addVirtualFuncCall({
        func: baseClassSubImpl,
        range: {
            start: { line: 10, column: 1 },
            end: { line: 10, column: 10 },
        },
    });

    database.writeDatabase();

    return [
        config,
        database,
        baseClassAddDecl,
        baseClassSubImpl,
        childClassAddImpl,
        childClassSubImpl,
        testImpl1,
        testImpl2,
    ];
}

suite("Get Incoming Calls", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("Simple non virtual functions get from declaration", () => {
        const [config, database, addDecl, subImpl, testImpl1, testImpl2] =
            setUpNonVirtualFunctionsTest();

        const treeItem = new TreeItem(config, database, addDecl);

        const incomingCalls = treeItem.getIncomingCalls(
            new CancellationToken()
        );

        assert.equal(incomingCalls.length, 1);

        const testImpl1CallItem = incomingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "test1"
        );
        assert.notEqual(testImpl1CallItem, undefined);
        assertFuncEquals(testImpl1CallItem!.getFunc(), testImpl1);
    });

    test("Simple non virtual functions get from implementation", () => {
        const [config, database, addDecl, subImpl, testImpl1, testImpl2] =
            setUpNonVirtualFunctionsTest();

        const treeItem = new TreeItem(config, database, subImpl);

        const incomingCalls = treeItem.getIncomingCalls(
            new CancellationToken()
        );

        assert.equal(incomingCalls.length, 2);

        const testImpl1CallItem = incomingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "test1"
        );
        assert.notEqual(testImpl1CallItem, undefined);
        assertFuncEquals(testImpl1CallItem!.getFunc(), testImpl1);

        const testImpl2CallItem = incomingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "test2"
        );
        assert.notEqual(testImpl2CallItem, undefined);
        assertFuncEquals(testImpl2CallItem!.getFunc(), testImpl2);
    });

    test("Simple virtual functions get from base class declaration", () => {
        const [
            config,
            database,
            baseClassAddDecl,
            baseClassSubImpl,
            childClassAddImpl,
            childClassSubImpl,
            testImpl1,
            testImpl2,
        ] = setUpVirtualFunctionsTest();
        const treeItem = new TreeItem(config, database, baseClassAddDecl);

        const incomingCalls = treeItem.getIncomingCalls(
            new CancellationToken()
        );

        assert.equal(incomingCalls.length, 2);

        const testImpl1CallItem = incomingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "test1"
        );
        assert.notEqual(testImpl1CallItem, undefined);
        assertFuncEquals(testImpl1CallItem!.getFunc(), testImpl1);

        const testImpl2CallItem = incomingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "test2"
        );
        assert.notEqual(testImpl2CallItem, undefined);
        assertFuncEquals(testImpl2CallItem!.getFunc(), testImpl2);
    });

    test("Simple virtual functions get from child class implementation", () => {
        const [
            config,
            database,
            baseClassAddDecl,
            baseClassSubImpl,
            childClassAddImpl,
            childClassSubImpl,
            testImpl1,
            testImpl2,
        ] = setUpVirtualFunctionsTest();
        const treeItem = new TreeItem(config, database, childClassAddImpl);

        const incomingCalls = treeItem.getIncomingCalls(
            new CancellationToken()
        );

        assert.equal(incomingCalls.length, 2);

        const testImpl1CallItem = incomingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "test1"
        );
        assert.notEqual(testImpl1CallItem, undefined);
        assertFuncEquals(testImpl1CallItem!.getFunc(), testImpl1);

        const testImpl2CallItem = incomingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "test2"
        );
        assert.notEqual(testImpl2CallItem, undefined);
        assertFuncEquals(testImpl2CallItem!.getFunc(), testImpl2);
    });

    test("Simple virtual functions get from base class implementation", () => {
        const [
            config,
            database,
            baseClassAddDecl,
            baseClassSubImpl,
            childClassAddImpl,
            childClassSubImpl,
            testImpl1,
            testImpl2,
        ] = setUpVirtualFunctionsTest();
        const treeItem = new TreeItem(config, database, baseClassSubImpl);

        const incomingCalls = treeItem.getIncomingCalls(
            new CancellationToken()
        );

        assert.equal(incomingCalls.length, 2);

        const testImpl1CallItem = incomingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "test1"
        );
        assert.notEqual(testImpl1CallItem, undefined);
        assertFuncEquals(testImpl1CallItem!.getFunc(), testImpl1);

        const testImpl2CallItem = incomingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "test2"
        );
        assert.notEqual(testImpl2CallItem, undefined);
        assertFuncEquals(testImpl2CallItem!.getFunc(), testImpl2);
    });
});
