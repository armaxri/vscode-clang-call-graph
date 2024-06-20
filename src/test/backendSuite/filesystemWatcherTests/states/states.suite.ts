import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../helper/mocha_test_helper";
import { createNewFilesystemWatcher } from "../filesystem_watcher_test";
import { delay } from "../../../../backend/utils/utils";
import { FilesystemWatcherState } from "../../../../backend/ClangFilesystemWatcher";

suite("State Handling", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("don't start without request", async () => {
        const [watcher, _] = createNewFilesystemWatcher(__dirname);
        assert.strictEqual(watcher.isRunning(), false);
        await delay(20);
        assert.strictEqual(watcher.isRunning(), false);
    });

    test("correct state handling", async () => {
        const [watcher, _] = createNewFilesystemWatcher(__dirname);
        await delay(20);
        assert.strictEqual(watcher["state"], FilesystemWatcherState.initial);

        await delay(20);
        assert.strictEqual(watcher["state"], FilesystemWatcherState.initial);

        await watcher.startWatching();

        assert.strictEqual(watcher["state"], FilesystemWatcherState.running);
        assert.strictEqual(watcher.isRunning(), true);

        await delay(20);
        assert.strictEqual(watcher["state"], FilesystemWatcherState.running);
        assert.strictEqual(watcher.isRunning(), true);

        await watcher.stopWatching();
        assert.strictEqual(watcher["state"], FilesystemWatcherState.stopping);
        assert.strictEqual(watcher.isRunning(), true);

        await delay(20);
        assert.strictEqual(watcher["state"], FilesystemWatcherState.stopped);
        assert.strictEqual(watcher.isRunning(), false);
    });
});
