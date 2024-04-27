import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple virtual method", () => {
    test("implementations", () => {
        testAstWalkerResults(
            __dirname,
            "simple_virtual_method.json",
            "simple_virtual_method_expected.json" /*
            [
                {
                    funcName: "main",
                    funcAstName: "_main",
                    file: "/backendSuite/walkerTests/suite04/simple_virtual_method.cpp",
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
            [
                {
                    baseFuncAstName: "__ZN9TestClass3addEii",
                    funcImpl: {
                        funcName: "add",
                        funcAstName: "__ZN9TestClass3addEii",
                        file: "/backendSuite/walkerTests/suite04/simple_virtual_method.cpp",
                        startLoc: {
                            line: 4,
                            column: 17,
                        },
                        endLoc: {
                            line: 4,
                            column: 20,
                        },
                    },
                },
            ],
            undefined */
        );
    });

    test("calls", () => {
        testAstWalkerResults(
            __dirname,
            "simple_virtual_method.json",
            "simple_virtual_method_expected.json" /*
            undefined,
            [],
            undefined,
            [
                {
                    callingFuncAstName: "_main",
                    baseFuncAstName: "__ZN9TestClass3addEii",
                    callDetails: {
                        funcName: "add",
                        funcAstName: "__ZN9TestClass3addEii",
                        file: "/backendSuite/walkerTests/suite04/simple_virtual_method.cpp",
                        startLoc: {
                            line: 13,
                            column: 12,
                        },
                        endLoc: {
                            line: 13,
                            column: 26,
                        },
                    },
                },
            ] */
        );
    });
});
