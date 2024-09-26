import { ClangFilesystemWatcher } from "../../../backend/ClangFilesystemWatcher";
import { MockConfig } from "../helper/MockConfig";
import { MockAstWalkerFactory } from "../helper/MockAstWalkerFactory";
import { MockUserInterface } from "../helper/MockUserInterface";
import { LowdbDatabase } from "../../../backend/database/lowdb/LowdbDatabase";

export function createNewFilesystemWatcher(
    callingFileDirName: string
): [ClangFilesystemWatcher, MockAstWalkerFactory, LowdbDatabase] {
    const mockConfig = new MockConfig(callingFileDirName);
    const walkerFactory = new MockAstWalkerFactory();
    const database = new LowdbDatabase(mockConfig);

    return [
        new ClangFilesystemWatcher(
            mockConfig,
            new MockUserInterface(mockConfig),
            walkerFactory,
            database
        ),
        walkerFactory,
        database,
    ];
}
