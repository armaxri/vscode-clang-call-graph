import { DatabaseType } from "../../../../backend/Config";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple class method", () => {
    test("full test", async () => {
        await testAstWalkerResults(
            __dirname,
            "simple_method.json",
            "simple_method_expected_db.json"
        );
    });

    test("test against lowdb", async () => {
        await testAstWalkerAgainstSpecificDatabase(
            __dirname,
            "simple_method.json",
            "simple_method_expected_db.json",
            DatabaseType.lowdb
        );
    });
});
