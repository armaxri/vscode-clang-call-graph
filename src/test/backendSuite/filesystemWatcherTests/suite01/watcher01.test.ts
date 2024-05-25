import * as assert from "assert";
import { createNewFilesystemWatcher } from "../filesystem_watcher_test";
import { delay } from "./../../../../backend/utils/utils";
import { ClangFilesystemWatcher } from "../../../../backend/ClangFilesystemWatcher";
import { MockAstWalkerFactory } from "../../helper/MockAstWalkerFactory";
import { adjustTsToJsPath } from "../../helper/path_helper";
import { LowdbDatabase } from "../../../../backend/database/lowdb/LowdbDatabase";
const fs = require("fs");

suite("Clang Filesystem Watcher File Finding Test Suite 01", () => {
    var watcher: ClangFilesystemWatcher;
    var mockWalkerFactory: MockAstWalkerFactory;
    var database: LowdbDatabase;
    var testDir: string;

    suiteSetup(async () => {
        const testDir = adjustTsToJsPath(__dirname);
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
    });

    setup(async () => {
        [watcher, mockWalkerFactory, database] =
            createNewFilesystemWatcher(__dirname);
        testDir = adjustTsToJsPath(__dirname);
    });

    test("all files found and walker was created", async () => {
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
    });

    teardown(async () => {
        watcher.stopWatching();
        await database.writeDatabase();
    });
});
