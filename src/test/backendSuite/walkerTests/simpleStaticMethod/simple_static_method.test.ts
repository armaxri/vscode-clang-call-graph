import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite: simple static methods in class", () => {
    test("implementations", () => {
        testAstWalkerResults(
            __dirname,
            "simple_static_method.json",
            "simple_static_method_expected.json" /*
            [
                {
                    funcName: "add",
                    funcAstName: "__ZN9TestClass3addEii",
                    file: "/backendSuite/walkerTests/suite02/simple_static_method.cpp",
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
                    file: "/backendSuite/walkerTests/suite02/simple_static_method.cpp",
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
            "simple_static_method.json",
            "simple_static_method_expected.json" /*
            undefined,
            [
                {
                    callingFuncAstName: "_main",
                    callDetails: {
                        funcName: "add",
                        funcAstName: "__ZN9TestClass3addEii",
                        file: "/backendSuite/walkerTests/suite02/simple_static_method.cpp",
                        startLoc: {
                            line: 12,
                            column: 12,
                        },
                        endLoc: {
                            line: 12,
                            column: 32,
                        },
                    },
                },
            ],
            [],
            []*/
        );
    });
});
