import { AstWalker } from "../../../backend/astWalker/AstWalker";

export class MockAstWalker implements AstWalker {
    public walkCnt: number = 0;
    public fileName: string = "";

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    async walkAst(): Promise<void> {
        this.walkCnt++;
        return;
    }

    getFileName(): string {
        return this.fileName;
    }
}
