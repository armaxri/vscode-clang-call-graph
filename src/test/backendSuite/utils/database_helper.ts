import * as fs from "fs";
import {
    Config,
    DatabaseType,
    convertStrToDatabaseType,
} from "../../../backend/Config";
import { Database } from "../../../backend/database/Database";
import { LowdbDatabase } from "../../../backend/database/lowdb/LowdbDatabase";
import { MockConfig } from "./MockConfig";
import { adjustTsToJsPath } from "./path_helper";

export async function createDatabase(config: Config): Promise<Database> {
    switch (config.getSelectedDatabaseType()) {
        case DatabaseType.lowdb:
            return new LowdbDatabase(config);
        default:
            throw new Error("Unknown database type");
    }
}

export async function removeOldDatabase(
    dirname: string,
    databaseType: DatabaseType
): Promise<void> {
    const adjustedDirname = adjustTsToJsPath(dirname);
    const config = new MockConfig(adjustedDirname, databaseType);
    await removeOldDatabaseFromConfig(config);
}

export async function removeOldDatabaseFromConfig(
    config: Config
): Promise<void> {
    const dbPath = config.getSelectedDatabasePath();
    if (fs.existsSync(dbPath)) {
        fs.rmSync(dbPath, { recursive: true });
    }
}

export async function removeOldDatabases(dirname: string): Promise<void> {
    const adjustedDirname = adjustTsToJsPath(dirname);
    for (const dbType in DatabaseType) {
        const config = new MockConfig(
            adjustedDirname,
            convertStrToDatabaseType(dbType)
        );
        const dbPath = config.getSelectedDatabasePath();
        if (fs.existsSync(dbPath)) {
            fs.rmSync(dbPath, { recursive: true });
        }
    }
}
