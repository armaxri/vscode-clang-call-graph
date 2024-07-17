import { Config } from "../Config";
import { Database } from "../database/Database";
import { File, FuncBasics } from "../database/cpp_structure";
import { CancellationToken } from "./CancellationToken";

export class TreeItem {
    protected config: Config;
    protected database: Database;
    protected func: FuncBasics;

    constructor(config: Config, database: Database, func: FuncBasics) {
        this.config = config;
        this.database = database;
        this.func = func;
    }

    getFunc(): FuncBasics {
        return this.func;
    }

    getFile(): File {
        return this.func.getFile()!;
    }

    isMethod(): boolean {
        // TODO: This is only a part of the question. Non virtual methods are not covered yet.
        return this.func.isVirtual();
    }

    getIncomingCalls(cancellationToken: CancellationToken): TreeItem[] {
        const incomingCalls: TreeItem[] = [];

        throw new Error("Method not implemented.");

        return incomingCalls;
    }

    getOutgoingCalls(cancellationToken: CancellationToken): TreeItem[] {
        const outgoingCalls: TreeItem[] = [];

        throw new Error("Method not implemented.");

        return outgoingCalls;
    }
}
