import { AstWalker } from "../../../backend/astWalker/AstWalker";

export class MockAstWalker implements AstWalker {
    public walkCnt: number = 0;
    public fileName: string = "";

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    async walkAst(): Promise<void> {
        this.walkCnt++;
        console.log(
            `MockAstWalker on ${this.getFileName()} was called for the ${
                this.walkCnt
            } time.`
        );
        return;
    }

    getFileName(): string {
        return this.fileName;
    }
}
