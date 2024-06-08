import { DatabaseType } from "../../../../backend/Config";
import { Database } from "../../../../backend/database/Database";
import { createDatabase } from "../../../../backend/database/helper/database_factory";
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

export function prepareDatabaseEqualityTests(
    callingFileDirName: string,
    referenceDatabaseFilename: string,
    databaseType: DatabaseType = DatabaseType.lowdb
): [Database, Database] {
    removeOldDatabase(callingFileDirName, databaseType);

    const referenceDatabase = loadReferenceDb(
        callingFileDirName,
        referenceDatabaseFilename
    );

    const mockConfig = new MockConfig(callingFileDirName, databaseType);
    const database = createDatabase(mockConfig);

    return [database, referenceDatabase];
}
