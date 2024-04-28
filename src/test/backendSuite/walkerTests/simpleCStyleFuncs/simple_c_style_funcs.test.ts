import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple C style functions", () => {
    test("full test", () => {
        testAstWalkerResults(
            __dirname,
            "simple_c_style_funcs.json",
            "simple_c_style_funcs_expected_db.json"
        );
    });
});
