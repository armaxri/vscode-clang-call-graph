import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { testAstWalkerAgainstSpecificDatabase } from "../../../ast_walker_test";

suite("funcs", () => {
    addSuitesInSubDirsSuites(__dirname);

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
        test(`test against ${DatabaseType[testData]}`, () => {
            testAstWalkerAgainstSpecificDatabase(
                __dirname,
                ["file.json"],
                "expected_db.json",
                testData
            );
        });
    });
});
