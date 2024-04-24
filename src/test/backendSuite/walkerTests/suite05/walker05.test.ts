import { testAstWalkerResults } from "../ast_walker_test";

suite("Clang AST Walker Test Suite 05", () => {
    test("simple_inherited_virtual_method implementation", () => {
        testAstWalkerResults(
            __dirname,
            "simple_inherited_virtual_method.json",
            "simple_inherited_virtual_method_expected.json" /*,
            [
                {
                    funcName: "main",
                    funcAstName: "_main",
                    file: "/backendSuite/walkerTests/suite05/simple_inherited_virtual_method.cpp",
                    startLoc: {
                        line: 19,
                        column: 5,
                    },
                    endLoc: {
                        line: 19,
                        column: 9,
                    },
                },
            ],
            undefined,
            [
                {
                    baseFuncAstName: "__ZN13TestBaseClass3addEii",
                    funcImpl: {
                        funcName: "add",
                        funcAstName: "__ZN13TestBaseClass3addEii",
                        file: "/backendSuite/walkerTests/suite05/simple_inherited_virtual_method.cpp",
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
                {
                    baseFuncAstName: "__ZN13TestBaseClass3addEii",
                    funcImpl: {
                        funcName: "add",
                        funcAstName: "__ZN9TestClass3addEii",
                        file: "/backendSuite/walkerTests/suite05/simple_inherited_virtual_method.cpp",
                        startLoc: {
                            line: 13,
                            column: 9,
                        },
                        endLoc: {
                            line: 13,
                            column: 12,
                        },
                    },
                },
            ],
            undefined */
        );
    });

    test("simple_inherited_virtual_method call", () => {
        testAstWalkerResults(
            __dirname,
            "simple_inherited_virtual_method.json",
            "simple_inherited_virtual_method_expected.json" /*,
            undefined,
            undefined,
            undefined,
            [
                {
                    callingFuncAstName: "__ZN9TestClass3addEii",
                    baseFuncAstName: "__ZN13TestBaseClass3addEii",
                    callDetails: {
                        funcName: "add",
                        funcAstName: "__ZN13TestBaseClass3addEii",
                        file: "/backendSuite/walkerTests/suite05/simple_inherited_virtual_method.cpp",
                        startLoc: {
                            line: 15,
                            column: 16,
                        },
                        endLoc: {
                            line: 15,
                            column: 46,
                        },
                    },
                },
                {
                    callingFuncAstName: "_main",
                    baseFuncAstName: "__ZN13TestBaseClass3addEii",
                    callDetails: {
                        funcName: "add",
                        funcAstName: "__ZN9TestClass3addEii",
                        file: "/backendSuite/walkerTests/suite05/simple_inherited_virtual_method.cpp",
                        startLoc: {
                            line: 22,
                            column: 12,
                        },
                        endLoc: {
                            line: 22,
                            column: 31,
                        },
                    },
                },
            ] */
        );
    });
});
