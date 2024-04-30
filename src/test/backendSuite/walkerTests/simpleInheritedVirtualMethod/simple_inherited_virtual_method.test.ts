import { DatabaseType } from "../../../../backend/Config";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple inherited virtual methods", () => {
    test("full test", () => {
        testAstWalkerResults(
            __dirname,
            "simple_inherited_virtual_method.json",
            "simple_inherited_virtual_method_expected_db.json"
        );
    });

    test("test against lowdb", () => {
        testAstWalkerAgainstSpecificDatabase(
            __dirname,
            "simple_inherited_virtual_method.json",
            "simple_inherited_virtual_method_expected_db.json",
            DatabaseType.lowdb
        );
    });
});
