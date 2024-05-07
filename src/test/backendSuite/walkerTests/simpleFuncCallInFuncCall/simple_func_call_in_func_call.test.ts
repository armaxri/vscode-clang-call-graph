import { DatabaseType } from "../../../../backend/Config";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../ast_walker_test";

suite(
    "Clang AST Walker Test Suite: simple function call in function call",
    () => {
        test("full test", async () => {
            await testAstWalkerResults(
                __dirname,
                "simple_func_call_in_func_call.json",
                "simple_func_call_in_func_call_expected_db.json"
            );
        });

        test("test against lowdb", async () => {
            await testAstWalkerAgainstSpecificDatabase(
                __dirname,
                "simple_func_call_in_func_call.json",
                "simple_func_call_in_func_call_expected_db.json",
                DatabaseType.lowdb
            );
        });
    }
);
