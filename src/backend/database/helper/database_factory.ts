import { Config, DatabaseType } from "../../Config";
import { Database } from "../Database";
import { LowdbDatabase } from "../lowdb/LowdbDatabase";

export function createDatabase(config: Config): Database {
    switch (config.getSelectedDatabaseType()) {
        case DatabaseType.lowdb:
            return new LowdbDatabase(config);
        default:
            throw new Error(
                "Database type not supported: " +
                    config.getSelectedDatabaseType()
            );
    }
}
