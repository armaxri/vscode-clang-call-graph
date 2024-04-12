import { IAstWalker } from "../../../backend/clangAst/IAstWalker";

export class MockAstWalker implements IAstWalker {
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
