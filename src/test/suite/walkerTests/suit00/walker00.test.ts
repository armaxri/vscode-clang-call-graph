import * as assert from "assert";
import * as vscode from "vscode";
import { loadAst } from "../../utils/clang_ast_json_loader";
import { adjustTsToJsPath } from "../../utils/adjust_ts_to_js_path";
import {
    MockDatabase,
    orderArrayorderArraysByLineAndColumnsByLine,
    orderArraysByLineAndColumn,
} from "../../utils/MockDatabase";
import { FuncCall, FuncMentioning } from "../../../../IDatabase";
import { ClangAstWalker } from "../../../../ClangAstWalker";

suite("Clang AST Walker Test Suite 00", () => {
    test("main implementation", () => {
        const clangAst = loadAst(adjustTsToJsPath(__dirname), "main.json");
        var database = new MockDatabase();
        var astWalker = new ClangAstWalker(clangAst, database);

        astWalker.walkAst();

        const expectedImpls: Array<FuncMentioning> = [
            {
                funcName: "divide",
                funcAstName: "__Z6divideii",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/simple_c_style_func.h",
                startLoc: {
                    line: 5,
                    column: 5,
                },
                endLoc: {
                    line: 5,
                    column: 11,
                },
            },
            {
                funcName: "sub",
                funcAstName: "__Z3subii",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/main.cpp",
                startLoc: {
                    line: 5,
                    column: 5,
                },
                endLoc: {
                    line: 5,
                    column: 8,
                },
            },
            {
                funcName: "main",
                funcAstName: "_main",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/main.cpp",
                startLoc: {
                    line: 10,
                    column: 5,
                },
                endLoc: {
                    line: 10,
                    column: 9,
                },
            },
        ];

        assert.deepEqual(
            orderArrayorderArraysByLineAndColumnsByLine(
                database.funcImplementations
            ),
            orderArrayorderArraysByLineAndColumnsByLine(expectedImpls)
        );
    });

    test("simple_c_style_func implementation", () => {
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
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/simple_c_style_func.h",
                startLoc: {
                    line: 5,
                    column: 5,
                },
                endLoc: {
                    line: 5,
                    column: 11,
                },
            },
            {
                funcName: "mult",
                funcAstName: "__Z4multii",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/simple_c_style_func.cpp",
                startLoc: {
                    line: 3,
                    column: 5,
                },
                endLoc: {
                    line: 3,
                    column: 9,
                },
            },
            {
                funcName: "add",
                funcAstName: "__ZN3foo3addEii",
                file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/simple_c_style_func.cpp",
                startLoc: {
                    line: 16,
                    column: 5,
                },
                endLoc: {
                    line: 16,
                    column: 8,
                },
            },
        ];

        assert.deepEqual(
            orderArrayorderArraysByLineAndColumnsByLine(
                database.funcImplementations
            ),
            orderArrayorderArraysByLineAndColumnsByLine(expectedImpls)
        );
    });

    test("main calls", () => {
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
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/main.cpp",
                    startLoc: {
                        line: 12,
                        column: 12,
                    },
                    endLoc: {
                        line: 12,
                        column: 22,
                    },
                },
            },
            {
                callingFuncAstName: "_main",
                callDetails: {
                    funcName: "add",
                    funcAstName: "__ZN3foo3addEii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/main.cpp",
                    startLoc: {
                        line: 12,
                        column: 25,
                    },
                    endLoc: {
                        line: 13,
                        column: 14,
                    },
                },
            },
            {
                callingFuncAstName: "_main",
                callDetails: {
                    funcName: "sub",
                    funcAstName: "__Z3subii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/main.cpp",
                    startLoc: {
                        line: 14,
                        column: 9,
                    },
                    endLoc: {
                        line: 14,
                        column: 19,
                    },
                },
            },
            {
                callingFuncAstName: "_main",
                callDetails: {
                    funcName: "divide",
                    funcAstName: "__Z6divideii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/main.cpp",
                    startLoc: {
                        line: 15,
                        column: 9,
                    },
                    endLoc: {
                        line: 16,
                        column: 18,
                    },
                },
            },
        ];

        assert.deepEqual(
            orderArraysByLineAndColumn(database.funcCalls),
            orderArraysByLineAndColumn(expectedCalls)
        );
    });

    test("simple_c_style_func calls", () => {
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
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit00/simple_c_style_func.cpp",
                    startLoc: {
                        line: 8,
                        column: 18,
                    },
                    endLoc: {
                        line: 8,
                        column: 40,
                    },
                },
            },
        ];

        assert.deepEqual(
            orderArraysByLineAndColumn(database.funcCalls),
            orderArraysByLineAndColumn(expectedCalls)
        );
    });
});
