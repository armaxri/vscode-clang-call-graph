# Clang Call Graph

**Early Testing Version!** This extension uses LLVM/Clang to create an extensive call graph out of your project.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

Your development environment is all you need. No additional downloads are required.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

-   `myExtension.enable`: Enable/disable this extension.
-   `myExtension.thing`: Set to `blah` to do something.

## Known Issues

-   [Only clang compiler commands are supported:](https://github.com/armaxri/vscode-clang-call-graph/issues/2) The extension only supports clang compiler commands. This is due to the fact that the extension uses clang´s AST to generate the call graph. Other compilers like gcc or msvc do not provide the necessary information in the AST.
-   [Location exceeds the actual function name:](https://github.com/armaxri/vscode-clang-call-graph/issues/1) For the detection of the function name, the whole range is used from the beginning of the first character to the closing bracket and not just the function name part. This comes from a limitation of clang´s AST. On the function call `foo::add(4, 4)` clang will report as location for the function start only the namespace `foo`.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release of Clang Call Graph extension.
