import * as assert from "assert";
import * as utils from "../../../backend/utils/utils";

suite("Utils Test Suite", () => {
    test("getEscapedChar", () => {
        assert.strictEqual(utils.getEscapedChar("\\", '"'), "\\");
        assert.strictEqual(utils.getEscapedChar("\\", "'"), "\\");
        assert.strictEqual(utils.getEscapedChar("0", '"'), "\0");
        assert.strictEqual(utils.getEscapedChar("0", "'"), "\0");
        assert.strictEqual(utils.getEscapedChar("a", '"'), "a");
        assert.strictEqual(utils.getEscapedChar("a", "'"), "a");
        assert.strictEqual(utils.getEscapedChar("b", '"'), "\b");
        assert.strictEqual(utils.getEscapedChar("b", "'"), "\b");
        assert.strictEqual(utils.getEscapedChar("t", '"'), "\t");
        assert.strictEqual(utils.getEscapedChar("t", "'"), "\t");
        assert.strictEqual(utils.getEscapedChar("n", '"'), "\n");
        assert.strictEqual(utils.getEscapedChar("n", "'"), "\n");
        assert.strictEqual(utils.getEscapedChar("v", '"'), "\v");
        assert.strictEqual(utils.getEscapedChar("v", "'"), "\v");
        assert.strictEqual(utils.getEscapedChar("f", '"'), "\f");
        assert.strictEqual(utils.getEscapedChar("f", "'"), "\f");
        assert.strictEqual(utils.getEscapedChar("r", '"'), "\r");
        assert.strictEqual(utils.getEscapedChar("r", "'"), "\r");
        assert.strictEqual(utils.getEscapedChar("'", "'"), "'");
        assert.strictEqual(utils.getEscapedChar("'", '"'), "\\'");
        assert.strictEqual(utils.getEscapedChar('"', '"'), '"');
        assert.strictEqual(utils.getEscapedChar('"', "'"), '\\"');
        assert.strictEqual(utils.getEscapedChar("x", '"'), "\\x");
        assert.strictEqual(utils.getEscapedChar("x", "'"), "\\x");
    });

    test("splitArguments: test simple args split", () => {
        const result = utils.splitArguments("hallo welt!");
        const expected = ["hallo", "welt!"];
        assert.deepStrictEqual(result, expected);
    });

    test("splitArguments: test args split with string 1", () => {
        const result = utils.splitArguments(
            '-p "hello b\\"ar baz" -f /^ [^ ]+ $/ -c -d -e'
        );
        const expected = [
            "-p",
            'hello b"ar baz',
            "-f",
            "/^",
            "[^",
            "]+",
            "$/",
            "-c",
            "-d",
            "-e",
        ];
        assert.deepStrictEqual(result, expected);
    });

    test("splitArguments: test args split with string 2", () => {
        const result = utils.splitArguments(
            "-p 'hello b\\\"ar baz' -f /^ [^ ]+ $/ -c -d -e"
        );
        const expected = [
            "-p",
            'hello b\\"ar baz',
            "-f",
            "/^",
            "[^",
            "]+",
            "$/",
            "-c",
            "-d",
            "-e",
        ];
        assert.deepStrictEqual(result, expected);
    });

    test("splitArguments: test extra spaces", () => {
        const result = utils.splitArguments("-p    -f   -c -d -e");
        const expected = ["-p", "-f", "-c", "-d", "-e"];
        assert.deepStrictEqual(result, expected);
    });

    test("splitArguments: test args split with string connected to argument", () => {
        const result = utils.splitArguments('-p="hello b\\"ar baz" -f');
        const expected = ['-p=hello b"ar baz', "-f"];
        assert.deepStrictEqual(result, expected);
    });

    test("splitArguments", () => {
        assert.deepStrictEqual(utils.splitArguments("\\"), ["\\"]);
        assert.deepStrictEqual(utils.splitArguments("'\""), ['"']);
        assert.deepStrictEqual(utils.splitArguments("\"'"), ["'"]);
        assert.deepStrictEqual(utils.splitArguments(""), []);
    });

    test("createClangAstCall: simple test", () => {
        const result = utils.createClangAstCall(
            "/usr/bin/clang++  -I/Users/arne/work/git/vscode-clang-call-graph/test_workspaces/workspace00 -g -arch arm64 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX12.3.sdk -o CMakeFiles/Workspace00Exe.dir/simple_c_style_func.cpp.o -c /Users/arne/work/git/vscode-clang-call-graph/test_workspaces/workspace00/simple_c_style_func.cpp"
        );
        const expected = [
            "/usr/bin/clang++",
            "-I/Users/arne/work/git/vscode-clang-call-graph/test_workspaces/workspace00",
            "-g",
            "-arch",
            "arm64",
            "-isysroot",
            "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX12.3.sdk",
            "-c",
            "/Users/arne/work/git/vscode-clang-call-graph/test_workspaces/workspace00/simple_c_style_func.cpp",
            "-Xclang",
            "-ast-dump=json",
            "-fsyntax-only",
        ];
        assert.deepStrictEqual(result, expected);
    });
});
