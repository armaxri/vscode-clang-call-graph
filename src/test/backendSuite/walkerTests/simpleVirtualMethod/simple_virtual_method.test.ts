import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple virtual method", () => {
    test("full test", () => {
        testAstWalkerResults(
            __dirname,
            "simple_virtual_method.json",
            "simple_virtual_method_expected_db.json"
        );
    });
});
