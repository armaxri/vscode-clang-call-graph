import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite 01", () => {
    test("simple_func_call_in_func_call", () => {
        testAstWalkerResults(
            __dirname,
            "simple_func_call_in_func_call.json",
            undefined,
            [
                {
                    callingFuncAstName: "_main",
                    callDetails: {
                        funcName: "add",
                        funcAstName: "__Z3addii",
                        file: "/backendSuite/walkerTests/suite01/simple_func_call_in_func_call.cpp",
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
                        file: "/backendSuite/walkerTests/suite01/simple_func_call_in_func_call.cpp",
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
            ],
            [],
            []
        );
    });

    test("multiline_func_call_in_func_call", () => {
        testAstWalkerResults(
            __dirname,
            "multiline_func_call_in_func_call.json",
            undefined,
            [
                {
                    callingFuncAstName: "_main",
                    callDetails: {
                        funcName: "add",
                        funcAstName: "__Z3addii",
                        file: "/backendSuite/walkerTests/suite01/multiline_func_call_in_func_call.cpp",
                        startLoc: {
                            line: 8,
                            column: 12,
                        },
                        endLoc: {
                            line: 10,
                            column: 11,
                        },
                    },
                },
                {
                    callingFuncAstName: "_main",
                    callDetails: {
                        funcName: "add",
                        funcAstName: "__Z3addii",
                        file: "/backendSuite/walkerTests/suite01/multiline_func_call_in_func_call.cpp",
                        startLoc: {
                            line: 9,
                            column: 9,
                        },
                        endLoc: {
                            line: 9,
                            column: 18,
                        },
                    },
                },
            ],
            [],
            []
        );
    });
});
