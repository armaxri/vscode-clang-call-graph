import { AstWalker } from "../../../backend/clangAst/AstWalker";
import { AstWalkerFactory } from "../../../backend/clangAst/AstWalkerFactory";
import { Database } from "../../../backend/database/Database";
import { MockAstWalker } from "./MockAstWalker";

export type ReceivedRequest = {
    fileName: string;
    command: string;
    database: Database;
};

export class MockAstWalkerFactory implements AstWalkerFactory {
    public receivedRequests: Array<ReceivedRequest> =
        new Array<ReceivedRequest>();
    public generatedAstWalkers: Array<MockAstWalker> =
        new Array<MockAstWalker>();

    constructor() {}

    public createAstWalker(
        fileName: string,
        command: string,
        database: Database
    ): AstWalker {
        this.receivedRequests.push({ fileName, command, database });
        const newAstWalker = new MockAstWalker(fileName);
        this.generatedAstWalkers.push(newAstWalker);

        return newAstWalker;
    }
}
