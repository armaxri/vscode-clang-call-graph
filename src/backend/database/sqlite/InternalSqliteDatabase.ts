import Database from "better-sqlite3";
import { Config } from "../../Config";
import { SqliteCppFile } from "./impls/SqliteCppFile";

export class InternalSqliteDatabase {
    private config: Config;
    public db!: Database.Database;

    constructor(config: Config) {
        this.config = config;

        this.loadDatabase();
    }

    loadDatabase() {
        const databaseExists = this.config.getSqliteDatabasePath().doesExist();

        this.db = new Database(
            this.config.getSqliteDatabasePath().pathString(),
            { verbose: this.config.runVerbose() ? console.log : undefined }
        );

        if (!databaseExists) {
            this.initDatabase();
        }
    }

    private initDatabase() {
        SqliteCppFile.createTableCall(this);
    }

    resetDatabase() {
        this.db.close();
        this.config.getSqliteDatabasePath().tryToRemove();
        this.loadDatabase();
    }
}
