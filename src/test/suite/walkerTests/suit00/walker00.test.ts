import { testAstWalkerResults } from "../../utils/ast_walker_test";

suite("Clang AST Walker Test Suite 00", () => {
    test("main implementation", () => {
        testAstWalkerResults(
            __dirname,
            "main.json",
            [
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
            ],
            undefined,
            undefined,
            undefined
        );
    });

    test("simple_c_style_func implementation", () => {
        testAstWalkerResults(
            __dirname,
            "simple_c_style_func.json",
            [
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
            ],
            undefined,
            undefined,
            undefined
        );
    });

    test("main calls", () => {
        testAstWalkerResults(
            __dirname,
            "main.json",
            undefined,
            [
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
            ],
            undefined,
            undefined
        );
    });

    test("simple_c_style_func calls", () => {
        testAstWalkerResults(
            __dirname,
            "simple_c_style_func.json",
            undefined,
            [
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
            ],
            undefined,
            undefined
        );
    });
});
