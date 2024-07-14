import { DatabaseType } from "../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import {
    testAstWalkerAgainstSpecificDatabase,
    testAstWalkerResults,
} from "../../ast_walker_test";

suite("simple decl in header which is used in two cpp files", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("full test", () => {
        testAstWalkerResults(
            __dirname,
            ["impl.json", "main.json"],
            "expected_db.json"
        );
    });

    test("test against lowdb", () => {
        testAstWalkerAgainstSpecificDatabase(
            __dirname,
            ["impl.json", "main.json"],
            "expected_db.json",
            DatabaseType.lowdb
        );
    });

    test("test against sqlite", () => {
        testAstWalkerAgainstSpecificDatabase(
            __dirname,
            ["impl.json", "main.json"],
            "expected_db.json",
            DatabaseType.sqlite
        );
    });
});
