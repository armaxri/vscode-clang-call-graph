import { testAstWalkerResults } from "../ast_walker_test";

suite(
    "Clang AST Walker Test Suite: multiline function call in function call",
    () => {
        test("full test", () => {
            testAstWalkerResults(
                __dirname,
                "multiline_func_call_in_func_call.json",
                "multiline_func_call_in_func_call_expected_db.json"
            );
        });
    }
);
