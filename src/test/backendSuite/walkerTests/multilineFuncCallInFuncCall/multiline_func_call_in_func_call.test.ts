import { testAstWalkerResults } from "../ast_walker_test";

suite(
    "Clang AST Walker Test Suite: multiline function call in function call",
    () => {
        test("calls", () => {
            testAstWalkerResults(
                __dirname,
                "multiline_func_call_in_func_call.json",
                "multiline_func_call_in_func_call_expected.json" /*,
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
            [] */
            );
        });
    }
);
