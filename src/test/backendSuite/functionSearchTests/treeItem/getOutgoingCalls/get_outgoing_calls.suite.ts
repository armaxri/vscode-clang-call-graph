import assert from "assert";
import { CancellationToken } from "../../../../../backend/functionSearch/CancellationToken";
import { createCleanLowdbDatabase } from "../../../helper/database_helper";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import { MockConfig } from "../../../helper/MockConfig";
import { TreeItem } from "../../../../../backend/functionSearch/TreeItem";
import { assertFuncEquals } from "../../../helper/database_equality";

suite("Get Outgoing Calls", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("Simple non virtual functions", () => {
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
        const subDecl = file.addFuncDecl({
            funcAstName: "sub",
            funcName: "sub",
            qualType: "void",
            range: {
                start: { line: 2, column: 1 },
                end: { line: 2, column: 10 },
            },
        });
        const subImpl = file.addFuncImpl({
            funcAstName: "sub",
            funcName: "sub",
            qualType: "void",
            range: {
                start: { line: 3, column: 1 },
                end: { line: 3, column: 10 },
            },
        });
        const testImpl = file.addFuncImpl({
            funcAstName: "test",
            funcName: "test",
            qualType: "void",
            range: {
                start: { line: 4, column: 1 },
                end: { line: 4, column: 10 },
            },
        });
        testImpl.addFuncCall({
            func: addDecl,
            range: {
                start: { line: 5, column: 1 },
                end: { line: 5, column: 10 },
            },
        });
        testImpl.addFuncCall({
            func: subDecl,
            range: {
                start: { line: 6, column: 1 },
                end: { line: 6, column: 10 },
            },
        });

        database.writeDatabase();

        const treeItem = new TreeItem(config, database, testImpl);

        const outgoingCalls = treeItem.getOutgoingCalls(
            new CancellationToken()
        );

        assert.equal(outgoingCalls.length, 2);
        const addCallItem =
            outgoingCalls[0].getFunc().getFuncName() === "add"
                ? outgoingCalls[0]
                : outgoingCalls[1];
        const subCallItem =
            addCallItem === outgoingCalls[0]
                ? outgoingCalls[1]
                : outgoingCalls[0];

        assertFuncEquals(addCallItem.getFunc(), addDecl);
        assertFuncEquals(subCallItem.getFunc(), subImpl);
    });

    test("Simple virtual functions", () => {
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
        const childClassMultiDecl = childClass.addVirtualFuncDecl({
            funcAstName: "childClass_multi",
            funcName: "multi",
            baseFuncAstName: "multi",
            qualType: "void",
            range: {
                start: { line: 5, column: 1 },
                end: { line: 5, column: 10 },
            },
        });

        const testImpl = file.addFuncImpl({
            funcAstName: "test",
            funcName: "test",
            qualType: "void",
            range: {
                start: { line: 6, column: 1 },
                end: { line: 6, column: 10 },
            },
        });

        testImpl.addVirtualFuncCall({
            func: baseClassAddDecl,
            range: {
                start: { line: 7, column: 1 },
                end: { line: 7, column: 10 },
            },
        });
        testImpl.addVirtualFuncCall({
            func: childClassSubImpl,
            range: {
                start: { line: 8, column: 1 },
                end: { line: 8, column: 10 },
            },
        });
        testImpl.addVirtualFuncCall({
            func: childClassMultiDecl,
            range: {
                start: { line: 9, column: 1 },
                end: { line: 9, column: 10 },
            },
        });

        database.writeDatabase();

        const treeItem = new TreeItem(config, database, testImpl);

        const outgoingCalls = treeItem.getOutgoingCalls(
            new CancellationToken()
        );

        assert.equal(outgoingCalls.length, 4);

        const addChildCallItem = outgoingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "childClass_add"
        );
        assert.notEqual(addChildCallItem, undefined);
        assertFuncEquals(addChildCallItem!.getFunc(), childClassAddImpl);

        const subChildCallItem = outgoingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "childClass_sub"
        );
        assert.notEqual(subChildCallItem, undefined);
        assertFuncEquals(subChildCallItem!.getFunc(), childClassSubImpl);

        const subBaseCallItem = outgoingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "baseClass_sub"
        );
        assert.notEqual(subBaseCallItem, undefined);
        assertFuncEquals(subBaseCallItem!.getFunc(), baseClassSubImpl);

        const multiChildCallItem = outgoingCalls.find(
            (item) => item.getFunc().getFuncAstName() === "childClass_multi"
        );
        assert.notEqual(multiChildCallItem, undefined);
        assertFuncEquals(multiChildCallItem!.getFunc(), childClassMultiDecl);
    });
});
