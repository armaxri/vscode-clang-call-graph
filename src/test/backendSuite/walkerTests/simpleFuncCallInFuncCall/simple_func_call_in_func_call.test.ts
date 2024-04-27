import { testAstWalkerResults } from "../ast_walker_test";

suite(
    "Clang AST Walker Test Suite: simple function call in function call",
    () => {
        test("calls", () => {
            testAstWalkerResults(
                __dirname,
                "simple_func_call_in_func_call.json",
                "simple_func_call_in_func_call_expected.json"
                /*
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
            [] */
            );
        });
    }
);
