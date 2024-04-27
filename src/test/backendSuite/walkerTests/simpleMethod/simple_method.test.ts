import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple class method", () => {
    test("implementations", () => {
        testAstWalkerResults(
            __dirname,
            "simple_method.json",
            "simple_method_expected.json" /*
            [
                {
                    funcName: "add",
                    funcAstName: "__ZN9TestClass3addEii",
                    file: "/backendSuite/walkerTests/suite03/simple_method.cpp",
                    startLoc: {
                        line: 4,
                        column: 9,
                    },
                    endLoc: {
                        line: 4,
                        column: 12,
                    },
                },
                {
                    funcName: "main",
                    funcAstName: "_main",
                    file: "/backendSuite/walkerTests/suite03/simple_method.cpp",
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
            [] */
        );
    });

    test("calls", () => {
        testAstWalkerResults(
            __dirname,
            "simple_method.json",
            "simple_method_expected.json" /*
            undefined,
            [
                {
                    callingFuncAstName: "_main",
                    callDetails: {
                        funcName: "add",
                        funcAstName: "__ZN9TestClass3addEii",
                        file: "/backendSuite/walkerTests/suite03/simple_method.cpp",
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
            ],
            [],
            [] */
        );
    });
});
