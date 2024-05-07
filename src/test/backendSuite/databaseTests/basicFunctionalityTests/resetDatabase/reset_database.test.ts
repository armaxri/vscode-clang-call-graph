import assert from "assert";
import { DatabaseType } from "../../../../../backend/Config";
import {
    loadReferenceDb,
    prepareDatabaseEqualityTests,
} from "../../typeEqualsTests/database_equality_tests";

suite("Database reset database tests", () => {
    [DatabaseType.lowdb].forEach(async (testData) => {
        test(`Test reset database on ${testData}`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const cppFile = database.getOrAddCppFile("simple_func_decl.json");
            cppFile.getOrAddFuncDecl({
                funcName: "add",
                funcAstName: "__ZN3foo3addEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 11, column: 5 },
                    end: { line: 11, column: 8 },
                },
            });

            database.writeDatabase();

            assert.ok(await database.equals(referenceDatabase));

            database.resetDatabase();
            database.writeDatabase();

            const emptyDatabase = await loadReferenceDb(
                __dirname,
                "empty_expected_db.json"
            );

            assert.ok(await database.equals(emptyDatabase));
        });
    });
});
