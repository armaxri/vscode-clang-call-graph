import { DatabaseType } from "../../../../backend/Config";
import { Database } from "../../../../backend/database/Database";
import { LowdbDatabase } from "../../../../backend/database/lowdb/LowdbDatabase";
import { MockConfig } from "../../utils/MockConfig";
import { removeOldDatabase } from "../../utils/database_helper";

export async function loadReferenceDb(
    callingFileDirName: string,
    referenceDatabaseFilename: string
): Promise<Database> {
    const referenceDbMockConfig = new MockConfig(
        callingFileDirName,
        DatabaseType.lowdb,
        referenceDatabaseFilename
    );
    return new LowdbDatabase(referenceDbMockConfig);
}

export async function prepareDatabaseEqualityTests(
    callingFileDirName: string,
    referenceDatabaseFilename: string,
    databaseType: DatabaseType = DatabaseType.lowdb
): Promise<[Database, Database]> {
    await removeOldDatabase(callingFileDirName, databaseType);

    const referenceDatabase = await loadReferenceDb(
        callingFileDirName,
        referenceDatabaseFilename
    );

    const mockConfig = new MockConfig(callingFileDirName, databaseType);
    const database = new LowdbDatabase(mockConfig);

    return [database, referenceDatabase];
}
