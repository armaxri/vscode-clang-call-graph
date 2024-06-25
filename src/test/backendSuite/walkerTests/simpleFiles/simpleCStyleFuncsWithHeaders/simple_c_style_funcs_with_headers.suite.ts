import { DatabaseType } from "../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../../ast_walker_test";

suite("simple C style functions with headers", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("full test", () => {
        testAstWalkerResults(
            __dirname,
            ["simple_c_style_funcs_with_headers.json"],
            "simple_c_style_funcs_with_headers_expected_db.json"
        );
    });

    test("test against lowdb", () => {
        testAstWalkerAgainstSpecificDatabase(
            __dirname,
            ["simple_c_style_funcs_with_headers.json"],
            "simple_c_style_funcs_with_headers_expected_db.json",
            DatabaseType.lowdb
        );
    });
});
