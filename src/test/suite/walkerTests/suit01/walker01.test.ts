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

suite("Clang AST Walker Test Suite 01", () => {
    test("simple_func_call_in_func_call", () => {
        const clangAst = loadAst(
            adjustTsToJsPath(__dirname),
            "simple_func_call_in_func_call.json"
        );
        var database = new MockDatabase();
        var astWalker = new ClangAstWalker(clangAst, database);

        astWalker.walkAst();

        const expectedCalls: Array<FuncCall> = [
            {
                callingFuncAstName: "_main",
                callDetails: {
                    funcName: "add",
                    funcAstName: "__Z3addii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit01/simple_func_call_in_func_call.cpp",
                    startLoc: {
                        line: 8,
                        column: 12,
                    },
                    endLoc: {
                        line: 8,
                        column: 29,
                    },
                },
            },
            {
                callingFuncAstName: "_main",
                callDetails: {
                    funcName: "add",
                    funcAstName: "__Z3addii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit01/simple_func_call_in_func_call.cpp",
                    startLoc: {
                        line: 8,
                        column: 16,
                    },
                    endLoc: {
                        line: 8,
                        column: 25,
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
