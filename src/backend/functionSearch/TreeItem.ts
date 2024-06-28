import { Config } from "../Config";
import { Database } from "../database/Database";
import { File, FuncBasics, VirtualFuncBasics } from "../database/cpp_structure";

export class TreeItem {
    protected config: Config;
    protected database: Database;
    protected func: FuncBasics;
    protected file: File;

    constructor(
        config: Config,
        database: Database,
        func: FuncBasics,
        file: File
    ) {
        this.config = config;
        this.database = database;
        this.func = func;
        this.file = file;
    }

    getFunc(): FuncBasics {
        return this.func;
    }

    getFile(): File {
        return this.file;
    }

    isMethod(): boolean {
        return this.func.isVirtual();
    }
}
