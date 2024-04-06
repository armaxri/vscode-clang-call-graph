import { ClangAstWalkerFactory } from "../../../backend/ClangAstWalkerFactory";
import { ClangFilesystemWatcher } from "../../../backend/ClangFilesystemWatcher";
import { MockConfig } from "../utils/MockConfig";

export function createNewFilesystemWatcher(
    callingFileDirName: string
): ClangFilesystemWatcher {
    return new ClangFilesystemWatcher(
        new MockConfig(callingFileDirName),
        new ClangAstWalkerFactory()
    );
}
