import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite 06", () => {
    test("simple_struct_method implementation", () => {
        testAstWalkerResults(
            __dirname,
            "simple_struct_method.json",
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
            []
        );
    });

    test("simple_struct_method call", () => {
        testAstWalkerResults(
            __dirname,
            "simple_struct_method.json",
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
            []
        );
    });
});
