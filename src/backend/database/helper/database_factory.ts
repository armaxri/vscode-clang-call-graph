import { Config, DatabaseType } from "../../Config";
import { Database } from "../Database";
import { LowdbDatabase } from "../lowdb/LowdbDatabase";
import { SqliteDatabase } from "../sqlite/SqliteDatabase";

export function createDatabase(config: Config): Database {
    switch (config.getSelectedDatabaseType()) {
        case DatabaseType.lowdb:
            return new LowdbDatabase(config);
        case DatabaseType.sqlite:
            return new SqliteDatabase(config);
        // istanbul ignore next
        default:
            throw new Error(
                "Database type not supported: " +
                    config.getSelectedDatabaseType()
            );
    }
}
