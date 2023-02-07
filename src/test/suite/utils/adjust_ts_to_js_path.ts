import { PathUtils } from "../../../utils/PathUtils";

export function adjustTsToJsPath(path: string): string {
    const thisFileDirPath = new PathUtils(path);
    const workspacePath = new PathUtils(
        thisFileDirPath.pathString(),
        "../../../../.."
    ).pathString();
    const workspaceRelativePath = path.replace(workspacePath, "");
    const newWorkspaceRelativePath = workspaceRelativePath.replace(
        "/out/",
        "/src/"
    );
    const newPath = new PathUtils(
        workspacePath,
        newWorkspaceRelativePath
    ).pathString();

    return newPath;
}
