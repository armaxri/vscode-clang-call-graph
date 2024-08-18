import * as assert from "assert";
import {
    FileType,
    getFileType,
} from "../../../backend/utils/cpp_file_ending_helper";

suite("C++ File Ending Helper", () => {
    test("getFileType", () => {
        assert.strictEqual(getFileType("foo.cpp"), FileType.source);
        assert.strictEqual(getFileType("foo.CPP"), FileType.source);
        assert.strictEqual(getFileType("foo.cxx"), FileType.source);
        assert.strictEqual(getFileType("foo.CXX"), FileType.source);
        assert.strictEqual(getFileType("foo.c++"), FileType.source);
        assert.strictEqual(getFileType("foo.C++"), FileType.source);
        assert.strictEqual(getFileType("foo.cp"), FileType.source);
        assert.strictEqual(getFileType("foo.CP"), FileType.source);
        assert.strictEqual(getFileType("foo.cc"), FileType.source);
        assert.strictEqual(getFileType("foo.CC"), FileType.source);
        assert.strictEqual(getFileType("foo.c"), FileType.source);
        assert.strictEqual(getFileType("foo.C"), FileType.source);
        assert.strictEqual(getFileType("foo.hpp"), FileType.header);
        assert.strictEqual(getFileType("foo.HPP"), FileType.header);
        assert.strictEqual(getFileType("foo.h"), FileType.header);
        assert.strictEqual(getFileType("foo.H"), FileType.header);

        assert.strictEqual(getFileType("foo"), FileType.header);
        assert.strictEqual(getFileType("foo.cppp"), FileType.header);
    });
});
