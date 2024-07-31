import { DatabaseType } from "../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import { testAstWalkerAgainstSpecificDatabase } from "../../ast_walker_test";

suite("simple decl in header impl in header and one cpp", () => {
    addSuitesInSubDirsSuites(__dirname);

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
        test(`test against ${DatabaseType[testData]}`, () => {
            testAstWalkerAgainstSpecificDatabase(
                __dirname,
                ["main.json"],
                "expected_db.json",
                testData
            );
        });
    });
});
