import * as clangAst from "./clang_ast_json";

export function hasCompoundStmtInInner(
    astElement: clangAst.AstElement
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
    element: clangAst.AstElement
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
