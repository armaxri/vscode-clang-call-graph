import * as sqlite3 from "sqlite3";
import { Config } from "../../Config";

export class InternalSqliteDatabase {
    private config: Config;
    public db!: sqlite3.Database;

    constructor(config: Config) {
        this.config = config;

        this.loadDatabase();
    }

    loadDatabase() {
        const databaseLoader = this.config.runVerbose()
            ? sqlite3.verbose()
            : sqlite3;

        // TODO: Check the caching part.
        this.db = new databaseLoader.Database(
            this.config.getSqliteDatabasePath().pathString()
        );
    }

    resetDatabase() {
        this.db.close();
        this.loadDatabase();
    }
}
