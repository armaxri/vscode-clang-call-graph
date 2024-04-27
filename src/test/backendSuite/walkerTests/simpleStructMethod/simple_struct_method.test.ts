import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple method in struct", () => {
    test("implementations", () => {
        testAstWalkerResults(
            __dirname,
            "simple_struct_method.json",
            "simple_struct_method_expected.json" /*,
            [
                {
                    funcName: "add",
                    funcAstName: "__ZN10TestStruct3addEii",
                    file: "/backendSuite/walkerTests/suite06/simple_struct_method.cpp",
                    startLoc: {
                        line: 3,
                        column: 9,
                    },
                    endLoc: {
                        line: 3,
                        column: 12,
                    },
                },
                {
                    funcName: "main",
                    funcAstName: "_main",
                    file: "/backendSuite/walkerTests/suite06/simple_struct_method.cpp",
                    startLoc: {
                        line: 9,
                        column: 5,
                    },
                    endLoc: {
                        line: 9,
                        column: 9,
                    },
                },
            ],
            undefined,
            [],
            [] */
        );
    });

    test("calls", () => {
        testAstWalkerResults(
            __dirname,
            "simple_struct_method.json",
            "simple_struct_method_expected.json" /*,
            undefined,
            [
                {
                    callingFuncAstName: "_main",
                    callDetails: {
                        funcName: "add",
                        funcAstName: "__ZN10TestStruct3addEii",
                        file: "/backendSuite/walkerTests/suite06/simple_struct_method.cpp",
                        startLoc: {
                            line: 12,
                            column: 12,
                        },
                        endLoc: {
                            line: 12,
                            column: 26,
                        },
                    },
                },
            ],
            [],
            [] */
        );
    });
});
