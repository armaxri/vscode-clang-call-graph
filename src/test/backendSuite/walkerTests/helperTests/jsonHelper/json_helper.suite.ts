import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import {
    hasCompoundStmtInInner,
    isElementVirtualFuncDeclaration,
} from "../../../../../backend/astWalker/clang/clang_ast_json_helper";

suite("simple virtual method", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("hasCompoundStmtInInner no inner, so no match", () => {
        assert.ok(
            !hasCompoundStmtInInner({ id: "1", kind: "NotCompoundStmt" })
        );
    });

    test("isElementVirtualFuncDeclaration no inner, so no match", () => {
        assert.ok(
            !isElementVirtualFuncDeclaration({
                id: "1",
                kind: "NotCompoundStmt",
            })
        );
    });
});
