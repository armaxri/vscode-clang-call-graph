import { Config } from "../Config";
import * as db from "./Database";
import * as sqlite from "sqlite3";

const CURRENT_DATABASE_VERSION = 1;

export class SqliteDatabase implements db.Database {
    private config: Config;
    private database!: sqlite.Database;

    constructor(config: Config) {
        this.config = config;

        this.initDatabase();
    }
    hasHppFile(name: string): boolean {
        throw new Error("Method not implemented.");
    }
    getOrAddHppFile(name: string): db.HppFile {
        throw new Error("Method not implemented.");
    }
    addHppFile(name: string): db.HppFile {
        throw new Error("Method not implemented.");
    }
    removeHppFileAndDependingContent(name: string): void {
        throw new Error("Method not implemented.");
    }

    hasCppFile(name: string): boolean {
        throw new Error("Method not implemented.");
    }
    getOrAddCppFile(name: string): db.CppFile {
        throw new Error("Method not implemented.");
    }
    removeCppFileAndDependingContent(name: string): void {
        throw new Error("Method not implemented.");
    }
    writeDatabase(): void {
        throw new Error("Method not implemented.");
    }

    resetDatabase() {
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
                this.config.getSqliteDatabasePath()
            );
        } else {
            console.log("Not using cached database.");
            this.database = new sqlite3Handle.Database(
                this.config.getSqliteDatabasePath()
            );
        }
    }
}
