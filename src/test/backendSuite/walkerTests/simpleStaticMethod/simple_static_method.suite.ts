import { DatabaseType } from "../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../helper/mocha_test_helper";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../ast_walker_test";

suite("simple static methods in class", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("full test", async () => {
        await testAstWalkerResults(
            __dirname,
            "simple_static_method.json",
            "simple_static_method_expected_db.json"
        );
    });

    test("test against lowdb", async () => {
        await testAstWalkerAgainstSpecificDatabase(
            __dirname,
            "simple_static_method.json",
            "simple_static_method_expected_db.json",
            DatabaseType.lowdb
        );
    });
});
