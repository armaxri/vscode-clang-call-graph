import * as assert from "assert";
import { DatabaseType } from "../../../../../backend/Config";
import { prepareDatabaseEqualityTests } from "../database_equlaity_tests";

suite("Database CppFile equality tests", () => {
    [DatabaseType.lowdb].forEach(async (testData) => {
        test(`Test equality for simple class on ${testData}`, async () => {
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
        });
    });

    [DatabaseType.lowdb].forEach(async (testData) => {
        test(`Test no equality for simple class on ${testData} based on empty database`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );

            database.writeDatabase();

            assert.ok(!(await database.equals(referenceDatabase)));
        });
    });

    [DatabaseType.lowdb].forEach(async (testData) => {
        test(`Test no equality for simple class on ${testData} based wrong file name`, async () => {
            const [database, referenceDatabase] =
                await prepareDatabaseEqualityTests(
                    __dirname,
                    "simple_func_decl_expected_db.json",
                    testData
                );
            const cppFile = database.getOrAddCppFile(
                "stupid_simple_func_decl.json"
            );
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

            assert.ok(!(await database.equals(referenceDatabase)));
        });
    });
});
