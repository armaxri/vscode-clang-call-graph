import { Config } from "../Config";
import { Database } from "../database/Database";
import {
    File,
    FuncBasics,
    FuncImplBasics,
    FuncType,
} from "../database/cpp_structure";
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

        // Only continue if the function is an implementation.
        if (this.func.getFuncType() === FuncType.implementation) {
            const funcImpl = this.func as FuncImplBasics;

            // TODO: Consider first ordering the calls by appearance before searching the impls.

            // We get the func calls and map them directly to the corresponding implementations.
            funcImpl.getFuncCalls().forEach((funcCall) => {
                const impls = this.database.getFuncImplsOrOneDecl(funcCall);
                for (const impl of impls) {
                    outgoingCalls.push(
                        new TreeItem(this.config, this.database, impl)
                    );
                }
            });

            funcImpl.getVirtualFuncCalls().forEach((funcCall) => {
                const impls = this.database.getFuncImplsOrOneDecl(funcCall);
                for (const impl of impls) {
                    outgoingCalls.push(
                        new TreeItem(this.config, this.database, impl)
                    );
                }
            });
        }

        return outgoingCalls;
    }
}
