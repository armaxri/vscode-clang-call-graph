import { DatabaseType } from "../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../../ast_walker_test";

suite("simple inherited virtual methods", () => {
    addSuitesInSubDirsSuites(__dirname);

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
