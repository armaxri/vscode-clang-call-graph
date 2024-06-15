import * as fs from "fs";
import { Config, DatabaseType } from "../../../backend/Config";
import { MockConfig } from "./MockConfig";
import { adjustTsToJsPath } from "./path_helper";

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

/*
export async function removeOldDatabases(dirname: string): Promise<void> {
    const adjustedDirname = adjustTsToJsPath(dirname);
    for (const dbType in DatabaseType) {
        const config = new MockConfig(
            adjustedDirname,
            convertStrToDatabaseType(dbType)
        );
        const dbPath = config.getSelectedDatabasePath().pathString();
        if (fs.existsSync(dbPath)) {
            fs.rmSync(dbPath, { recursive: true });
        }
    }
}
*/
