import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";
import { AbstractDatabase } from "../../../../../../backend/database/impls/AbstractDatabase";
import { assertHeaderFileEquals } from "../../../../helper/database_equality";
import { HppFile } from "../../../../../../backend/database/cpp_structure";

suite("Cpp File", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple cpp with one hpp", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const cppFile = database.getOrAddCppFile("file.cpp");
                const hppFile = database.getOrAddHppFile("file.hpp");

                hppFile.addReferencedFromFile(cppFile.getName());

                database.writeDatabase();

                assert.equal(cppFile.getIncludes().length, 1);
                assertHeaderFileEquals(
                    cppFile.getIncludes()[0] as HppFile,
                    hppFile
                );
            });
        });
    });

    suite("Simple cpp with chain of hpp files", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(
                    __dirname,
                    testData
                ) as AbstractDatabase;

                const includingCppFile =
                    database.getOrAddCppFile("includingFile.cpp");
                const middleHppFile =
                    database.getOrAddHppFile("middleFile.hpp");
                const includedHppFile =
                    database.getOrAddHppFile("includedFile.hpp");

                includedHppFile.addReferencedFromFile(
                    includingCppFile.getName()
                );
                includedHppFile.addReferencedFromFile(middleHppFile.getName());
                middleHppFile.addReferencedFromFile(includingCppFile.getName());

                database.writeDatabase();

                assert.equal(includingCppFile.getIncludes().length, 2);
                assert.equal(middleHppFile.getIncludes().length, 1);
                assert.equal(includedHppFile.getIncludes().length, 0);
                assertHeaderFileEquals(
                    middleHppFile.getIncludes()[0] as HppFile,
                    includedHppFile
                );
                assert.deepEqual(
                    includingCppFile
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
