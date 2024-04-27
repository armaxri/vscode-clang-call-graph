import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple C style functions", () => {
    test("pure declarations", () => {
        testAstWalkerResults(
            __dirname,
            "simple_c_style_funcs.json",
            "simple_c_style_funcs_expected_db.json" /*,
            [
                {
                    funcName: "divide",
                    funcAstName: "__Z6divideii",
                    file: "/backendSuite/walkerTests/suite00/simple_c_style_func.h",
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
                    file: "/backendSuite/walkerTests/suite00/main.cpp",
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
                    file: "/backendSuite/walkerTests/suite00/main.cpp",
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
            [],
            []*/
        );
    });

    test("implementations", () => {
        testAstWalkerResults(
            __dirname,
            "simple_c_style_funcs.json",
            "simple_c_style_funcs_expected_db.json" /*,
            [
                {
                    funcName: "divide",
                    funcAstName: "__Z6divideii",
                    file: "/backendSuite/walkerTests/suite00/simple_c_style_func.h",
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
                    file: "/backendSuite/walkerTests/suite00/main.cpp",
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
                    file: "/backendSuite/walkerTests/suite00/main.cpp",
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
            [],
            []*/
        );
    });

    test("calls", () => {
        testAstWalkerResults(
            __dirname,
            "simple_c_style_funcs.json",
            "simple_c_style_funcs_expected_db.json" /*,
            undefined,
            [
                {
                    callingFuncAstName: "_main",
                    callDetails: {
                        funcName: "mult",
                        funcAstName: "__Z4multii",
                        file: "/backendSuite/walkerTests/suite00/main.cpp",
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
                        file: "/backendSuite/walkerTests/suite00/main.cpp",
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
                        file: "/backendSuite/walkerTests/suite00/main.cpp",
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
                        file: "/backendSuite/walkerTests/suite00/main.cpp",
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
            [],
            []*/
        );
    });
});
