import { DatabaseType } from "../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../../ast_walker_test";

suite("simple virtual method", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("full test", () => {
        testAstWalkerResults(
            __dirname,
            "simple_virtual_method.json",
            "simple_virtual_method_expected_db.json"
        );
    });

    test("test against lowdb", () => {
        testAstWalkerAgainstSpecificDatabase(
            __dirname,
            "simple_virtual_method.json",
            "simple_virtual_method_expected_db.json",
            DatabaseType.lowdb
        );
    });
});
