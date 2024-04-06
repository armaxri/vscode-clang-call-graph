import * as assert from "assert";
import { createNewFilesystemWatcher } from "../filesystem_watcher_test";
import { delay } from "./../../../../backend/utils/utils";

suite("Clang Filesystem Watcher Test Suite 00", () => {
    test("don't start without request", async () => {
        const watcher = createNewFilesystemWatcher(__dirname);
        assert.strictEqual(watcher.isRunning(), false);
        await delay(500);
        assert.strictEqual(watcher.isRunning(), false);
    });

    test("don't stop without request", async () => {
        const watcher = createNewFilesystemWatcher(__dirname);
        watcher.startWatching();
        await delay(500);
        assert.strictEqual(watcher.isRunning(), true);
        watcher.stopWatching();
        await delay(500);
        assert.strictEqual(watcher.isRunning(), false);
    });
});
