import assert from "assert";
import { DatabaseType } from "../../../../../backend/Config";
import {
    loadReferenceDb,
    prepareDatabaseEqualityTests,
} from "../../typeEqualsTests/database_equality_tests";

suite("Database reset database tests", () => {
    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test reset database on ${DatabaseType[testData]}`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_file_expected_db.json",
                    testData
                );
            await database.getOrAddCppFile("simple_func_decl.json");

            await database.writeDatabase();

            assert.ok(await database.equals(referenceDatabase));

            await database.resetDatabase();
            await database.writeDatabase();

            const emptyDatabase = await loadReferenceDb(
                __dirname,
                "empty_expected_db.json"
            );

            assert.ok(await database.equals(emptyDatabase));
        });
    });

    [DatabaseType.lowdb, DatabaseType.sqlite].forEach(async (testData) => {
        test(`Test reset database on ${DatabaseType[testData]} with function declaration`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const cppFile = await database.getOrAddCppFile(
                "simple_func_decl.json"
            );
            await cppFile.getOrAddFuncDecl({
                funcName: "add",
                funcAstName: "__ZN3foo3addEii",
                qualType: "int (int, int)",
                range: {
                    start: { line: 11, column: 5 },
                    end: { line: 11, column: 8 },
                },
            });

            await database.writeDatabase();

            assert.ok(await database.equals(referenceDatabase));

            await database.resetDatabase();
            await database.writeDatabase();

            const emptyDatabase = await loadReferenceDb(
                __dirname,
                "empty_expected_db.json"
            );

            assert.ok(await database.equals(emptyDatabase));
        });
    });
});
