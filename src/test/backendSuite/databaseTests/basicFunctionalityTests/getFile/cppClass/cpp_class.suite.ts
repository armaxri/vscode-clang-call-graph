import assert from "assert";
import { DatabaseType } from "../../../../../../backend/Config";
import { addSuitesInSubDirsSuites } from "../../../../helper/mocha_test_helper";
import { openNewDatabase } from "../../../typeEqualsTests/database_equality_tests";

suite("Cpp Class", () => {
    addSuitesInSubDirsSuites(__dirname);

    suite("Simple with one cpp file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddCppFile("file.cpp");
                const cppClass = file.getOrAddClass("foo");

                database.writeDatabase();

                assert.notEqual(cppClass.getFile(), null);
                assert.equal(cppClass.getFile()?.getName(), file.getName());
            });
        });
    });

    suite("Simple with one hpp file", () => {
        [DatabaseType.lowdb, DatabaseType.sqlite].forEach((testData) => {
            test(`${DatabaseType[testData]}`, () => {
                const database = openNewDatabase(__dirname, testData);

                const file = database.getOrAddHppFile("file.h");
                const cppClass = file.getOrAddClass("foo");

                database.writeDatabase();

                assert.notEqual(cppClass.getFile(), null);
                assert.equal(cppClass.getFile()?.getName(), file.getName());
            });
        });
    });
});
