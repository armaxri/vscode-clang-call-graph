import * as assert from "assert";
import * as vscode from "vscode";
import { loadAst } from "../../utils/clang_ast_json_loader";
import { adjustTsToJsPath } from "../../utils/adjust_ts_to_js_path";
import { MockDatabase } from "../../utils/MockDatabase";
import { FuncMentioning } from "../../../../IDatabase";
import { ClangAstWalker } from "../../../../ClangAstWalker";

function orderArraysByLine(
    input: Array<FuncMentioning>
): Array<FuncMentioning> {
    return input.sort((element0, element1) => {
        return element0.line - element1.line;
    });
}

suite("Clang AST Test Suite 0", () => {
    test("test main implementation", () => {
        const clangAst = loadAst(adjustTsToJsPath(__dirname), "main.json");
        var database = new MockDatabase();
        var astWalker = new ClangAstWalker(clangAst, database);

        astWalker.walkAst();

        const expectedImpls: Array<FuncMentioning> = [
            {
                funcName: "divide",
                funcAstName: "__Z6divideii",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/simple_c_style_func.h",
                line: 5,
                columnStart: 5,
                columnEnd: 11,
            },
            {
                funcName: "sub",
                funcAstName: "__Z3subii",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/main.cpp",
                line: 5,
                columnStart: 5,
                columnEnd: 8,
            },
            {
                funcName: "main",
                funcAstName: "_main",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/main.cpp",
                line: 10,
                columnStart: 5,
                columnEnd: 9,
            },
        ];

        assert.deepEqual(
            orderArraysByLine(database.funcImplementations),
            orderArraysByLine(expectedImpls)
        );
    });

    test("test simple_c_style_func implementation", () => {
        const clangAst = loadAst(
            adjustTsToJsPath(__dirname),
            "simple_c_style_func.json"
        );
        var database = new MockDatabase();
        var astWalker = new ClangAstWalker(clangAst, database);

        astWalker.walkAst();

        const expectedImpls: Array<FuncMentioning> = [
            {
                funcName: "divide",
                funcAstName: "__Z6divideii",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/simple_c_style_func.h",
                line: 5,
                columnStart: 5,
                columnEnd: 11,
            },
            {
                funcName: "mult",
                funcAstName: "__Z4multii",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/simple_c_style_func.cpp",
                line: 3,
                columnStart: 5,
                columnEnd: 9,
            },
            {
                funcName: "add",
                funcAstName: "__ZN3foo3addEii",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/simple_c_style_func.cpp",
                line: 16,
                columnStart: 5,
                columnEnd: 8,
            },
        ];

        assert.deepEqual(
            orderArraysByLine(database.funcImplementations),
            orderArraysByLine(expectedImpls)
        );
    });
});
