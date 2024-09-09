import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import { MockUserInterface } from "../../../helper/MockUserInterface";
import { fileReaderFunc } from "../../../../../backend/astWalker/clang/clang_file_reader_func";

suite("cpp errors", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("run clang error in include name", () => {
        const userInterface: MockUserInterface = new MockUserInterface();

        const call = `clang++ -c ${__dirname.replace(
            "/out/",
            "/src/"
        )}/defectHeader.cpp -std=c++20 -o defectHeader.o`;

        const fileHandle = userInterface.createFileAnalysisHandle(
            "defectHeader.cpp",
            call
        );

        assert.equal(fileReaderFunc(fileHandle), null);
        assert.equal(userInterface.loggedErrors.length, 1);
        assert.ok(
            userInterface.loggedErrors[0].startsWith(
                `Error on parsing file "defectHeader.cpp" using command "${call}" resulting error message: Error: Command failed: clang++ -c`
            )
        );
        assert.ok(fileHandle.fileHandlingCompleted());
    });
});
