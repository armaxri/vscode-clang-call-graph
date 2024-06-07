import { DatabaseType } from "../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../helper/mocha_test_helper";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../ast_walker_test";

suite("multiline function call in function call", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("full test", async () => {
        await testAstWalkerResults(
            __dirname,
            "multiline_func_call_in_func_call.json",
            "multiline_func_call_in_func_call_expected_db.json"
        );
    });

    test("test against lowdb", async () => {
        await testAstWalkerAgainstSpecificDatabase(
            __dirname,
            "multiline_func_call_in_func_call.json",
            "multiline_func_call_in_func_call_expected_db.json",
            DatabaseType.lowdb
        );
    });
});
