import { IConfig } from "./IConfig";
import * as iDb from "./IDatabase";
import * as sqlite from "sqlite3";

const CURRENT_DATABASE_VERSION = 1;

export class SqliteDatabase implements iDb.IDatabase {
    private config: IConfig;
    private database!: sqlite.Database;

    constructor(config: IConfig) {
        this.config = config;

        this.initDatabase();
    }

    registerFuncDeclaration(funcDec: iDb.FuncMentioning): void {
        throw new Error("Method not implemented.");
    }

    registerFuncImplementation(funcImpl: iDb.FuncMentioning): void {
        throw new Error("Method not implemented.");
    }

    registerFuncCall(funcCall: iDb.FuncCall): void {
        throw new Error("Method not implemented.");
    }

    registerVirtualFuncDeclaration(funcDec: iDb.VirtualFuncMentioning): void {
        throw new Error("Method not implemented.");
    }

    registerVirtualFuncImplementation(
        funcImpl: iDb.VirtualFuncMentioning
    ): void {
        throw new Error("Method not implemented.");
    }

    registerVirtualFuncCall(funcCall: iDb.VirtualFuncCall): void {
        throw new Error("Method not implemented.");
    }

    public resetDatabase() {
        console.log("Resetting database.");
        console.log("Closing database.");
        this.database.close();
        console.log("Database closed.");
        console.log("Starting database again.");
        this.initDatabase();
    }

    private initDatabase() {
        console.log("Initializing database.");
        const sqlite3Handle: typeof sqlite = this.config.runVerbose()
            ? require("sqlite3").verbose()
            : require("sqlite3");
        if (this.config.useDatabaseCaching()) {
            console.log("Using cached database.");
            this.database = sqlite3Handle.cached.Database(
                this.config.getCallGraphDatabasePath()
            );
        } else {
            console.log("Not using cached database.");
            this.database = new sqlite3Handle.Database(
                this.config.getCallGraphDatabasePath()
            );
        }
    }
}
