import { testAstWalkerResults } from "../ast_walker_test";

suite(
    "Clang AST Walker Test Suite: simple function call in function call",
    () => {
        test("full test", () => {
            testAstWalkerResults(
                __dirname,
                "simple_func_call_in_func_call.json",
                "simple_func_call_in_func_call_expected_db.json"
            );
        });
    }
);
