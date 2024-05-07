export interface AstWalker {
    walkAst(): Promise<void>;

    getFileName(): string;
}
