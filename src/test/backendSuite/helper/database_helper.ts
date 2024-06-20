import * as fs from "fs";
import { Config, DatabaseType } from "../../../backend/Config";
import { MockConfig } from "./MockConfig";
import { adjustTsToJsPath } from "./path_helper";
import { Database } from "../../../backend/database/Database";
import { LowdbDatabase } from "../../../backend/database/lowdb/LowdbDatabase";

export function removeOldDatabase(
    dirname: string,
    databaseType: DatabaseType
): void {
    const adjustedDirname = adjustTsToJsPath(dirname);
    const config = new MockConfig(adjustedDirname, databaseType);
    removeOldDatabaseFromConfig(config);
}

function removeOldDatabaseFromConfig(config: Config): void {
    const dbPath = config.getSelectedDatabasePath().pathString();
    // istanbul ignore else
    if (fs.existsSync(dbPath)) {
        fs.rmSync(dbPath, { recursive: true });
    }
}

export function createCleanLowdbDatabase(dirname: string): Database {
    const adjustedDirname = adjustTsToJsPath(dirname);
    const config = new MockConfig(adjustedDirname, DatabaseType.lowdb);
    removeOldDatabaseFromConfig(config);
    return new LowdbDatabase(config);
}
