import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple static methods in class", () => {
    test("full test", () => {
        testAstWalkerResults(
            __dirname,
            "simple_static_method.json",
            "simple_static_method_expected_db.json"
        );
    });
});
