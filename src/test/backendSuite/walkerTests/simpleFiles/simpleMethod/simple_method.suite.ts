import { DatabaseType } from "../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../../ast_walker_test";

suite("simple class method", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("full test", () => {
        testAstWalkerResults(
            __dirname,
            ["simple_method.json"],
            "simple_method_expected_db.json"
        );
    });

    test("test against lowdb", () => {
        testAstWalkerAgainstSpecificDatabase(
            __dirname,
            ["simple_method.json"],
            "simple_method_expected_db.json",
            DatabaseType.lowdb
        );
    });
});
