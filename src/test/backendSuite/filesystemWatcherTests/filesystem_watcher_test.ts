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
            new MockUserInterface(),
            walkerFactory,
            database,
            // We don't need to actually watch the filesystem in tests,
            // so we set the interval to 10 ms.
            10
        ),
        walkerFactory,
        database,
    ];
}
