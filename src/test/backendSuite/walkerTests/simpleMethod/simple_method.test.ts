import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple class method", () => {
    test("full test", () => {
        testAstWalkerResults(
            __dirname,
            "simple_method.json",
            "simple_method_expected_db.json"
        );
    });
});
