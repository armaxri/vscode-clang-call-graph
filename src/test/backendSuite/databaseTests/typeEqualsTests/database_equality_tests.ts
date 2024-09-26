import { DatabaseType } from "../../../../backend/Config";
import { Database } from "../../../../backend/database/Database";
import { LowdbDatabase } from "../../../../backend/database/lowdb/LowdbDatabase";
import { MockConfig } from "../../helper/MockConfig";
import { removeOldDatabase } from "../../helper/database_helper";

export function loadReferenceDb(
    callingFileDirName: string,
    referenceDatabaseFilename: string
): Database {
    const referenceDbMockConfig = new MockConfig(
        callingFileDirName,
        DatabaseType.lowdb,
        referenceDatabaseFilename
    );
    return new LowdbDatabase(referenceDbMockConfig);
}

export function openDatabase(
    callingFileDirName: string,
    databaseType: DatabaseType
): Database {
    const mockConfig = new MockConfig(callingFileDirName, databaseType);
    return mockConfig.createDatabase();
}

export function openNewDatabase(
    callingFileDirName: string,
    databaseType: DatabaseType
): Database {
    removeOldDatabase(callingFileDirName, databaseType);

    return openDatabase(callingFileDirName, databaseType);
}

export function prepareDatabaseEqualityTests(
    callingFileDirName: string,
    referenceDatabaseFilename: string,
    databaseType: DatabaseType
): [Database, Database] {
    const referenceDatabase = loadReferenceDb(
        callingFileDirName,
        referenceDatabaseFilename
    );

    const database = openNewDatabase(callingFileDirName, databaseType);

    return [database, referenceDatabase];
}

export function getEmptyReferenceDatabase(): Database {
    return loadReferenceDb(__dirname, "empty_expected_db.json");
}
