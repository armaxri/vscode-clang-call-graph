import { IAstWalker } from "../../../backend/clangAst/IAstWalker";
import { IAstWalkerFactory } from "../../../backend/clangAst/IAstWalkerFactory";
import { IDatabase } from "../../../backend/database/IDatabase";
import { MockAstWalker } from "./MockAstWalker";

export type ReceivedRequest = {
    fileName: string;
    command: string;
    database: IDatabase;
};

export class MockAstWalkerFactory implements IAstWalkerFactory {
    public receivedRequests: Array<ReceivedRequest> =
        new Array<ReceivedRequest>();
    public generatedAstWalkers: Array<MockAstWalker> =
        new Array<MockAstWalker>();

    constructor() {}

    public createAstWalker(
        fileName: string,
        command: string,
        database: IDatabase
    ): IAstWalker {
        this.receivedRequests.push({ fileName, command, database });
        const newAstWalker = new MockAstWalker(fileName);
        this.generatedAstWalkers.push(newAstWalker);

        return newAstWalker;
    }
}
