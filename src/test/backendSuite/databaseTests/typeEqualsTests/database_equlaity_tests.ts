import { DatabaseType } from "../../../../backend/Config";
import { Database } from "../../../../backend/database/Database";
import { LowdbDatabase } from "../../../../backend/database/lowdb/LowdbDatabase";
import { MockConfig } from "../../utils/MockConfig";
import { removeOldDatabase } from "../../utils/database_helper";

export async function prepareDatabaseEqualityTests(
    callingFileDirName: string,
    referenceDatabaseFilename: string,
    databaseType: DatabaseType = DatabaseType.lowdb
): Promise<[Database, Database]> {
    await removeOldDatabase(callingFileDirName, databaseType);

    const referenceDbMockConfig = new MockConfig(
        callingFileDirName,
        DatabaseType.lowdb,
        referenceDatabaseFilename
    );
    const referenceDatabase = new LowdbDatabase(referenceDbMockConfig);

    const mockConfig = new MockConfig(callingFileDirName, databaseType);
    const database = new LowdbDatabase(mockConfig);

    return [database, referenceDatabase];
}
