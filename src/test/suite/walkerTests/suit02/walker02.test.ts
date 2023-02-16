import { testAstWalkerResults } from "../../utils/ast_walker_test";

suite("Clang AST Walker Test Suite 02", () => {
    test("simple_static_method implementation", () => {
        testAstWalkerResults(
            __dirname,
            "simple_static_method.json",
            [
                {
                    funcName: "add",
                    funcAstName: "__Z3subii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit02/simple_static_method.cpp",
                    startLoc: {
                        line: 4,
                        column: 16,
                    },
                    endLoc: {
                        line: 4,
                        column: 19,
                    },
                },
                {
                    funcName: "main",
                    funcAstName: "_main",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit02/simple_static_method.cpp",
                    startLoc: {
                        line: 10,
                        column: 5,
                    },
                    endLoc: {
                        line: 10,
                        column: 9,
                    },
                },
            ],
            undefined
        );
    });

    test("simple_static_method call", () => {
        testAstWalkerResults(
            __dirname,
            "simple_static_method.json",
            undefined,
            [
                {
                    callingFuncAstName: "_main",
                    callDetails: {
                        funcName: "add",
                        funcAstName: "__Z3addii",
                        file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit02/simple_static_method.cpp",
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
            ]
        );
    });
});
