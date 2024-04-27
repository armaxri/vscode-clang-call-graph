import * as clang_ast from "./clang_ast_json";

export function hasCompoundStmtInInner(
    astElement: clang_ast.AstElement
): boolean {
    if (astElement.inner) {
        const matches = astElement.inner.filter(
            (element) => element.kind === "CompoundStmt"
        );

        return matches.length > 0;
    }
    return false;
}

export function isElementVirtualFuncDeclaration(
    element: clang_ast.AstElement
): boolean {
    const hasOtherAttribute: boolean = element.inner
        ? element.inner.some(
              (innerElement) =>
                  innerElement.kind === "CXXFinalAttr" ||
                  innerElement.kind === "OverrideAttr"
          )
        : false;
    return (
        element.kind === "CXXMethodDecl" &&
        (element.virtual === true || hasOtherAttribute)
    );
}
