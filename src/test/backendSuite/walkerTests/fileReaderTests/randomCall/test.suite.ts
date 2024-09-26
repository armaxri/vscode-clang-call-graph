import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import { MockUserInterface } from "../../../helper/MockUserInterface";
import { fileReaderFunc } from "../../../../../backend/astWalker/clang/clang_file_reader_func";
import { MockConfig } from "../../../helper/MockConfig";

suite("random call", () => {
    addSuitesInSubDirsSuites(__dirname);

    test('run "cd .."', () => {
        const mockConfig = new MockConfig(__dirname);
        const userInterface: MockUserInterface = new MockUserInterface(
            mockConfig
        );
        const fileHandle = userInterface.createFileAnalysisHandle(
            "invalidCppCall.cpp",
            "cd .."
        );

        assert.equal(fileReaderFunc(fileHandle), null);
        assert.equal(userInterface.loggedErrors.length, 1);
        assert.equal(
            userInterface.loggedErrors[0],
            'Error on parsing file "invalidCppCall.cpp" using command "cd .." resulting error message: SyntaxError: Unexpected end of JSON input'
        );
        assert.ok(fileHandle.fileHandlingCompleted());
    });

    test('run "clang -v"', () => {
        const mockConfig = new MockConfig(__dirname);
        const userInterface: MockUserInterface = new MockUserInterface(
            mockConfig
        );
        const fileHandle = userInterface.createFileAnalysisHandle(
            "invalidCppCall.cpp",
            "clang -v"
        );

        assert.equal(fileReaderFunc(fileHandle), null);
        assert.equal(userInterface.loggedErrors.length, 1);
        assert.equal(
            userInterface.loggedErrors[0],
            'Error on parsing file "invalidCppCall.cpp" using command "clang -v" resulting error message: SyntaxError: Unexpected end of JSON input'
        );
        assert.ok(fileHandle.fileHandlingCompleted());
    });

    test('run clang with no existing file "clang++ -c keks.cpp -std=c++20 -o keks.o"', () => {
        const mockConfig = new MockConfig(__dirname);
        const userInterface: MockUserInterface = new MockUserInterface(
            mockConfig
        );
        const fileHandle = userInterface.createFileAnalysisHandle(
            "invalidCppCall.cpp",
            "clang++ -c keks.cpp -std=c++20 -o keks.o"
        );

        assert.equal(fileReaderFunc(fileHandle), null);
        assert.equal(userInterface.loggedErrors.length, 1);
        assert.ok(
            userInterface.loggedErrors[0].startsWith(
                'Error on parsing file "invalidCppCall.cpp" using command "clang++ -c keks.cpp -std=c++20 -o keks.o" resulting error message: Error: Command failed: clang++ -c keks.cpp -std=c++20 -Xclang -ast-dump=json -fsyntax-only'
            )
        );
        assert.ok(fileHandle.fileHandlingCompleted());
    });
});
