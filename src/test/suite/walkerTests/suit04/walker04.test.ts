import { testAstWalkerResults } from "../../utils/ast_walker_test";

suite("Clang AST Walker Test Suite 04", () => {
    test("simple_virtual_method implementation", () => {
        testAstWalkerResults(
            __dirname,
            "simple_virtual_method.json",
            [
                {
                    funcName: "main",
                    funcAstName: "_main",
                    file: "/suite/walkerTests/suit04/simple_virtual_method.cpp",
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
                        file: "/suite/walkerTests/suit04/simple_virtual_method.cpp",
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
            undefined
        );
    });

    test("simple_virtual_method call", () => {
        testAstWalkerResults(
            __dirname,
            "simple_virtual_method.json",
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
                        file: "/suite/walkerTests/suit04/simple_virtual_method.cpp",
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
            ]
        );
    });
});
