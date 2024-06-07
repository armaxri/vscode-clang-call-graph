import { PathUtils } from "../../../backend/utils/PathUtils";

export function adjustTsToJsPath(path: string): string {
    const workspacePath = new PathUtils(
        __dirname,
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
