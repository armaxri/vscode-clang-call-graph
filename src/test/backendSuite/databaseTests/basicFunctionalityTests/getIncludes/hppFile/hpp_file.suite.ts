import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";
import { AbstractDatabase } from "../../../../../../backend/database/impls/AbstractDatabase";

suite("Hpp File", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple hpp with one hpp", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const includingHppFile =
                    database.getOrAddHppFile("includingFile.hpp");
                const includedHppFile =
                    database.getOrAddHppFile("includedFile.hpp");

                includedHppFile.addReferencedFromFile(
                    includingHppFile.getName()
                );

                database.writeDatabase();

                assert.equal(includingHppFile.getIncludes().length, 1);
                assert.ok(
                    includingHppFile.getIncludes()[0].equals(includedHppFile)
                );
            });
        });
    });

    suite("Simple hpp with chain of hpp files", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const includingHppFile =
                    database.getOrAddHppFile("includingFile.hpp");
                const middleHppFile =
                    database.getOrAddHppFile("middleFile.hpp");
                const includedHppFile =
                    database.getOrAddHppFile("includedFile.hpp");

                includedHppFile.addReferencedFromFile(
                    includingHppFile.getName()
                );
                includedHppFile.addReferencedFromFile(middleHppFile.getName());
                middleHppFile.addReferencedFromFile(includingHppFile.getName());

                database.writeDatabase();

                assert.equal(includingHppFile.getIncludes().length, 2);
                assert.equal(middleHppFile.getIncludes().length, 1);
                assert.equal(includedHppFile.getIncludes().length, 0);
                assert.ok(
                    middleHppFile.getIncludes()[0].equals(includedHppFile)
                );
                assert.deepEqual(
                    includingHppFile
                        .getIncludes()
                        .map((file) => {
                            return file.getName();
                        })
                        .sort(),
                    [includedHppFile.getName(), middleHppFile.getName()].sort()
                );
            });
        });
    });
});
