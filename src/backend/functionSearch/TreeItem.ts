import { Config } from "../Config";
import { Database } from "../database/Database";
import { File, FuncBasics } from "../database/cpp_structure";

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
}
