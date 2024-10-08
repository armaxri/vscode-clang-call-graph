import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import { MockUserInterface } from "../../../helper/MockUserInterface";
import { fileReaderFunc } from "../../../../../backend/astWalker/clang/clang_file_reader_func";
import { MockConfig } from "../../../helper/MockConfig";

suite("cpp pass", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("run clang error in include name", () => {
        const mockConfig = new MockConfig(__dirname);
        const userInterface: MockUserInterface = new MockUserInterface(
            mockConfig
        );

        const call = `clang++ -c ${__dirname.replace(
            "/out/",
            "/src/"
        )}/simpleMain.cpp -std=c++20 -o simpleMain.o`;

        const fileHandle = userInterface.createFileAnalysisHandle(
            "simpleMain.cpp",
            call
        );

        assert.notEqual(fileReaderFunc(fileHandle), null);
        assert.equal(userInterface.loggedErrors.length, 0);
        assert.ok(!fileHandle.fileHandlingCompleted());
        assert.ok(!fileHandle.fileWasHandledSuccessfully());
    });
});
