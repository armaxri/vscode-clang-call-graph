import { testAstWalkerResults } from "../../utils/ast_walker_test";

suite("Clang AST Walker Test Suite 03", () => {
    test("simple_method implementation", () => {
        testAstWalkerResults(
            __dirname,
            "simple_method.json",
            [
                {
                    funcName: "add",
                    funcAstName: "__ZN9TestClass3addEii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit03/simple_method.cpp",
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
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit03/simple_method.cpp",
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
            undefined
        );
    });

    test("simple_method call", () => {
        testAstWalkerResults(__dirname, "simple_method.json", undefined, [
            {
                callingFuncAstName: "_main",
                callDetails: {
                    funcName: "add",
                    funcAstName: "__ZN9TestClass3addEii",
                    file: "/Users/arne/work/git/vscode-clang-call-graph/src/test/suite/walkerTests/suit03/simple_method.cpp",
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
        ]);
    });
});
