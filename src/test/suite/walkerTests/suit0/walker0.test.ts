import * as assert from "assert";
import * as vscode from "vscode";
import { loadAst } from "../../utils/clang_ast_json_loader";
import { adjustTsToJsPath } from "../../utils/adjust_ts_to_js_path";
import { MockDatabase } from "../../utils/MockDatabase";
import { FuncCall, FuncMentioning } from "../../../../IDatabase";
import { ClangAstWalker } from "../../../../ClangAstWalker";

function orderArrayorderArraysByLineAndColumnsByLine(
    input: Array<FuncMentioning>
): Array<FuncMentioning> {
    return input.sort((element0, element1) => {
        return element0.line !== element1.line
            ? element0.line - element1.line
            : element0.columnStart - element1.columnStart;
    });
}

function orderArraysByLineAndColumn(input: Array<FuncCall>): Array<FuncCall> {
    return input.sort((element0, element1) => {
        return element0.callDetails.line !== element1.callDetails.line
            ? element0.callDetails.line - element1.callDetails.line
            : element0.callDetails.columnStart -
                  element1.callDetails.columnStart;
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
            orderArrayorderArraysByLineAndColumnsByLine(
                database.funcImplementations
            ),
            orderArrayorderArraysByLineAndColumnsByLine(expectedImpls)
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
            orderArrayorderArraysByLineAndColumnsByLine(
                database.funcImplementations
            ),
            orderArrayorderArraysByLineAndColumnsByLine(expectedImpls)
        );
    });

    test("test main calls", () => {
        const clangAst = loadAst(adjustTsToJsPath(__dirname), "main.json");
        var database = new MockDatabase();
        var astWalker = new ClangAstWalker(clangAst, database);

        astWalker.walkAst();

        const expectedCalls: Array<FuncCall> = [
            {
                callingFuncAstName: "_main",
                callDetails: {
                    funcName: "mult",
                    funcAstName: "__Z4multii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/main.cpp",
                    line: 12,
                    columnStart: 12,
                    columnEnd: 16,
                },
            },
            {
                callingFuncAstName: "_main",
                callDetails: {
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/main.cpp",
                    line: 12,
                    columnStart: 25,
                    // TODO: Should be 33 but the walker only sees the namespace name.
                    columnEnd: 28,
                },
            },
            {
                callingFuncAstName: "_main",
                callDetails: {
                    funcName: "sub",
                    funcAstName: "__Z3subii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/main.cpp",
                    line: 12,
                    columnStart: 42,
                    columnEnd: 45,
                },
            },
            {
                callingFuncAstName: "_main",
                callDetails: {
                    funcName: "divide",
                    funcAstName: "__Z6divideii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/main.cpp",
                    line: 12,
                    columnStart: 55,
                    columnEnd: 61,
                },
            },
        ];

        assert.deepEqual(
            orderArraysByLineAndColumn(database.funcCalls),
            orderArraysByLineAndColumn(expectedCalls)
        );
    });

    test("test simple_c_style_func calls", () => {
        const clangAst = loadAst(
            adjustTsToJsPath(__dirname),
            "simple_c_style_func.json"
        );
        var database = new MockDatabase();
        var astWalker = new ClangAstWalker(clangAst, database);

        astWalker.walkAst();

        const expectedCalls: Array<FuncCall> = [
            {
                callingFuncAstName: "__Z4multii",
                callDetails: {
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit0/simple_c_style_func.cpp",
                    line: 8,
                    columnStart: 18,
                    // TODO: Should be 26 but the walker only sees the namespace name.
                    columnEnd: 21,
                },
            },
        ];

        assert.deepEqual(
            orderArraysByLineAndColumn(database.funcCalls),
            orderArraysByLineAndColumn(expectedCalls)
        );
    });
});
