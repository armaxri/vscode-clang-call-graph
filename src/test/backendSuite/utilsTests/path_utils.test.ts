import * as assert from "assert";
import { PathUtils } from "../../../backend/utils/PathUtils";
import * as fs from "fs";
import { delay } from "../../../backend/utils/utils";

suite("Path Utils Test Suite", () => {
    test("is directory", () => {
        const path = new PathUtils(__dirname);
        assert.equal(path.isDirectory(), true);
    });

    test("is not directory", () => {
        const path = new PathUtils(__filename);
        assert.equal(path.isDirectory(), false);
    });

    test("has parent dir", () => {
        const path = new PathUtils(__filename);
        assert.equal(path.hasParentDir(), true);
    });

    test("has no parent dir", () => {
        const path = new PathUtils("/");
        assert.equal(path.hasParentDir(), false);
    });

    test("get dir of file", () => {
        const path = new PathUtils(__filename);
        assert.equal(path.getDir().pathString(), __dirname);
    });

    test("get dir as dir", () => {
        const path = new PathUtils(__dirname);
        assert.equal(path.getDir().pathString(), __dirname);
    });

    test("join path", () => {
        const path = new PathUtils(__dirname);
        assert.equal(
            path.joinPath("path_utils.test.js").pathString(),
            __filename
        );
    });

    test("relative path", () => {
        const path = new PathUtils(__filename);
        assert.equal(
            path.getRelativePathString(new PathUtils(__dirname)),
            "path_utils.test.js"
        );
    });

    test("remove but file doesn't exists", () => {
        const path = new PathUtils(__dirname, "not_existing_file");
        assert.equal(path.remove(), false);
    });

    test("try to remove not existing file without error", () => {
        const path = new PathUtils(__dirname, "not_existing_file");
        path.tryToRemove();
    });

    test("create and remove test file", () => {
        const path = new PathUtils(__dirname, "test_file");
        path.tryToRemove();
        assert.equal(path.doesExist(), false);

        path.createFile();
        assert.equal(path.doesExist(), true);
        path.tryToRemove();
        assert.equal(path.doesExist(), false);
    });

    test("create already existing file", () => {
        const path = new PathUtils(__dirname, "test_file");
        const testContent = "test file content";
        path.tryToRemove();
        assert.equal(path.doesExist(), false);

        path.createFile();
        assert.equal(path.doesExist(), true);
        fs.writeFileSync(path.pathString(), testContent);

        assert.equal(fs.readFileSync(path.pathString(), "utf8"), testContent);
        path.createFile();
        assert.equal(path.doesExist(), true);
        assert.equal(fs.readFileSync(path.pathString(), "utf8"), testContent);

        path.tryToRemove();
        assert.equal(path.doesExist(), false);
    });

    test("check modification time", async () => {
        const path = new PathUtils(__dirname, "test_file");
        const testContent = "test file content";
        path.tryToRemove();
        assert.equal(path.doesExist(), false);

        const timestamp1 = Date.now();
        await delay(20);

        path.createFile();
        assert.equal(path.doesExist(), true);
        await delay(20);
        const modificationTime1 = path.getModificationTime().getTime();
        assert.equal(modificationTime1 > timestamp1, true);

        await delay(20);
        const timestamp2 = Date.now();
        assert.equal(modificationTime1 < timestamp2, true);

        fs.writeFileSync(path.pathString(), testContent);

        await delay(20);
        const modificationTime2 = path.getModificationTime().getTime();
        assert.equal(modificationTime2 > timestamp2, true);

        await delay(20);
        const timestamp3 = Date.now();
        assert.equal(modificationTime2 < timestamp3, true);

        path.tryToRemove();
        assert.equal(path.doesExist(), false);
    });

    // Date.now()
});
