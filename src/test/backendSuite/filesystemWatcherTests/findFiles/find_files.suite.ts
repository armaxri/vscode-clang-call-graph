import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../helper/mocha_test_helper";
import { createNewFilesystemWatcher } from "../filesystem_watcher_test";
import { delay } from "../../../../backend/utils/utils";
import { ClangFilesystemWatcher } from "../../../../backend/ClangFilesystemWatcher";
import { adjustTsToJsPath } from "../../helper/path_helper";
import { MockAstWalkerFactory } from "../../helper/MockAstWalkerFactory";
import { LowdbDatabase } from "../../../../backend/database/lowdb/LowdbDatabase";
const fs = require("fs");

suite("Find Files", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("correct state handling", async () => {
        var watcher: ClangFilesystemWatcher;
        var mockWalkerFactory: MockAstWalkerFactory;
        var database: LowdbDatabase;

        var testDir = adjustTsToJsPath(__dirname);
        fs.writeFileSync(
            `${testDir}/compile_commands.json`,
            `
        [
            {
                "directory": "${testDir}",
                "file": "${testDir}/testFile1.txt",
                "command": "Hello World",
                "output": "${testDir}/testFile1.txt"
            },
            {
                "directory": "${testDir}",
                "file": "${testDir}/testFile2.txt",
                "command": "Hello Clang",
                "output": "${testDir}/testFile2.txt"
            }
        ]
        `
        );

        [watcher, mockWalkerFactory, database] =
            createNewFilesystemWatcher(__dirname);
        testDir = adjustTsToJsPath(__dirname);

        watcher.startWatching();
        await delay(200);
        assert.strictEqual(mockWalkerFactory.generatedAstWalkers.length, 2);

        if (
            mockWalkerFactory.generatedAstWalkers[0].fileName ===
            `${testDir}/testFile1.txt`
        ) {
            assert.strictEqual(
                mockWalkerFactory.generatedAstWalkers[1].fileName,
                `${testDir}/testFile2.txt`
            );
        } else {
            assert.strictEqual(
                mockWalkerFactory.generatedAstWalkers[0].fileName,
                `${testDir}/testFile2.txt`
            );
            assert.strictEqual(
                mockWalkerFactory.generatedAstWalkers[1].fileName,
                `${testDir}/testFile1.txt`
            );
        }

        watcher.stopWatching();
        await database.writeDatabase();
    });
});
