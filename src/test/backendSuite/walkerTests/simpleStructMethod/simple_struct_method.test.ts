import { DatabaseType } from "../../../../backend/Config";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple method in struct", () => {
    test("full test", () => {
        testAstWalkerResults(
            __dirname,
            "simple_struct_method.json",
            "simple_struct_method_expected_db.json"
        );
    });

    test("test against lowdb", () => {
        testAstWalkerAgainstSpecificDatabase(
            __dirname,
            "simple_struct_method.json",
            "simple_struct_method_expected_db.json",
            DatabaseType.lowdb
        );
    });
});
