import { ClangAstWalkerFactory } from "../../../backend/ClangAstWalkerFactory";
import { ClangFilesystemWatcher } from "../../../backend/ClangFilesystemWatcher";
import { MockConfig } from "../utils/MockConfig";
import { MockAstWalkerFactory } from "../utils/MockAstWalkerFactory";

export function createNewFilesystemWatcher(
    callingFileDirName: string
): [ClangFilesystemWatcher, MockAstWalkerFactory] {
    const walkerFactory = new MockAstWalkerFactory();

    return [
        new ClangFilesystemWatcher(
            new MockConfig(callingFileDirName),
            walkerFactory,
            // We don't need to actually watch the filesystem in tests,
            // so we set the interval to 10 ms.
            10
        ),
        walkerFactory,
    ];
}
