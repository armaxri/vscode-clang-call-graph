import { DatabaseType } from "../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../helper/mocha_test_helper";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../ast_walker_test";

suite("simple method in struct", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("full test", async () => {
        await testAstWalkerResults(
            __dirname,
            "simple_struct_method.json",
            "simple_struct_method_expected_db.json"
        );
    });

    test("test against lowdb", async () => {
        await testAstWalkerAgainstSpecificDatabase(
            __dirname,
            "simple_struct_method.json",
            "simple_struct_method_expected_db.json",
            DatabaseType.lowdb
        );
    });
});
