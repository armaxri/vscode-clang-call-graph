import * as assert from "assert";
import { PathUtils } from "../../../backend/utils/PathUtils";
import * as fs from "fs";
import { delay } from "../../../backend/utils/utils";

suite("Path Utils Test Suite", () => {
    test("is directory", () => {
        const path = new PathUtils(__dirname);
        assert.ok(path.isDirectory());
    });

    test("is not directory", () => {
        const path = new PathUtils(__filename);
        assert.ok(!path.isDirectory());
    });

    test("has parent dir", () => {
        const path = new PathUtils(__filename);
        assert.ok(path.hasParentDir());
    });

    test("has no parent dir", () => {
        const path = new PathUtils("/");
        assert.ok(!path.hasParentDir());
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
            path.joinPath("path_utils.suite.js").pathString(),
            __filename
        );
    });

    test("relative path", () => {
        const path = new PathUtils(__filename);
        assert.equal(
            path.getRelativePathString(new PathUtils(__dirname)),
            "path_utils.suite.js"
        );
    });

    test("remove but file doesn't exists", () => {
        const path = new PathUtils(__dirname, "not_existing_file");
        assert.ok(!path.remove());
    });

    test("try to remove not existing file without error", () => {
        const path = new PathUtils(__dirname, "not_existing_file");
        path.tryToRemove();
    });

    test("create and remove test file", () => {
        const path = new PathUtils(__dirname, "test_file");
        path.tryToRemove();
        assert.ok(!path.doesExist());

        path.createFile();
        assert.ok(path.doesExist());
        path.tryToRemove();
        assert.ok(!path.doesExist());
    });

    test("create already existing file", () => {
        const path = new PathUtils(__dirname, "test_file");
        const testContent = "test file content";
        path.tryToRemove();
        assert.ok(!path.doesExist());

        path.createFile();
        assert.ok(path.doesExist());
        fs.writeFileSync(path.pathString(), testContent);

        assert.equal(fs.readFileSync(path.pathString(), "utf8"), testContent);
        path.createFile();
        assert.ok(path.doesExist());
        assert.equal(fs.readFileSync(path.pathString(), "utf8"), testContent);

        path.tryToRemove();
        assert.ok(!path.doesExist());
    });

    test("check modification time", async () => {
        const path = new PathUtils(__dirname, "test_file");
        const testContent = "test file content";
        path.tryToRemove();
        assert.ok(!path.doesExist());

        const timestamp1 = Date.now();
        await delay(5);

        path.createFile();
        assert.ok(path.doesExist());
        await delay(5);
        const modificationTime1 = path.getModificationTime().getTime();
        assert.ok(modificationTime1 > timestamp1);

        await delay(5);
        const timestamp2 = Date.now();
        assert.ok(modificationTime1 < timestamp2);
        await delay(5);

        fs.writeFileSync(path.pathString(), testContent);

        await delay(5);
        const modificationTime2 = path.getModificationTime().getTime();
        assert.ok(modificationTime2 > timestamp2);

        await delay(5);
        const timestamp3 = Date.now();
        assert.ok(modificationTime2 < timestamp3);

        path.tryToRemove();
        assert.ok(!path.doesExist());
    });
});
