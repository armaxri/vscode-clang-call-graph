import { DatabaseType } from "../../../../backend/Config";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../ast_walker_test";

suite(
    "Clang AST Walker Test Suite: simple C style functions with headers",
    () => {
        test("full test", () => {
            testAstWalkerResults(
                __dirname,
                "simple_c_style_funcs_with_headers.json",
                "simple_c_style_funcs_with_headers_expected_db.json"
            );
        });

        test("test against lowdb", () => {
            testAstWalkerAgainstSpecificDatabase(
                __dirname,
                "simple_c_style_funcs_with_headers.json",
                "simple_c_style_funcs_with_headers_expected_db.json",
                DatabaseType.lowdb
            );
        });
    }
);
