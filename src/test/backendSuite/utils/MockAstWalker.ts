import { AstWalker } from "../../../backend/clangAst/AstWalker";

export class MockAstWalker implements AstWalker {
    public walkCnt: number = 0;
    public fileName: string = "";

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    walkAst(): void {
        this.walkCnt++;
        return;
    }

    getFileName(): string {
        return this.fileName;
    }
}
