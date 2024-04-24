export interface AstWalker {
    walkAst(): void;

    getFileName(): string;
}
