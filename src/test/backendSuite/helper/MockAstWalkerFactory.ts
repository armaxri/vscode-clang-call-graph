import { AstWalker } from "../../../backend/astWalker/AstWalker";
import { AstWalkerFactory } from "../../../backend/astWalker/AstWalkerFactory";
import { FileAnalysisHandle } from "../../../backend/astWalker/FileAnalysisHandle";
import { Database } from "../../../backend/database/Database";
import { MockAstWalker } from "./MockAstWalker";

export type ReceivedRequest = {
    fileName: string;
    command: string;
    database: Database;
};

export class MockAstWalkerFactory implements AstWalkerFactory {
    public receivedRequests: ReceivedRequest[] = [];
    public generatedAstWalkers: MockAstWalker[] = [];

    constructor() {}

    public createAstWalker(
        database: Database,
        fileHandle: FileAnalysisHandle
    ): AstWalker {
        this.receivedRequests.push({
            fileName: fileHandle.getFileName(),
            command: fileHandle.getCommand(),
            database,
        });
        const newAstWalker = new MockAstWalker(fileHandle.getFileName());
        this.generatedAstWalkers.push(newAstWalker);

        return newAstWalker;
    }
}
