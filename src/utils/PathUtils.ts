import * as path from "path";
import * as fs from "fs";

export class PathUtils {
    private internalPathStr: string;

    constructor(pathString: string, addition: string = "") {
        const pathStringInt = path.join(pathString, addition).normalize();
        this.internalPathStr = pathStringInt;
    }

    public pathString(): string {
        return this.internalPathStr;
    }

    public isDirectory(): boolean {
        return fs.lstatSync(this.internalPathStr).isDirectory();
    }

    public getDir(): PathUtils {
        const pathRepresentation = new PathUtils(this.internalPathStr);
        return pathRepresentation.isDirectory()
            ? pathRepresentation
            : pathRepresentation.getParentDir();
    }

    public hasParentDir(): boolean {
        const currentPath = path.parse(this.internalPathStr);
        return this.internalPathStr !== currentPath.root;
    }

    public getParentDir(): PathUtils {
        const currentPath = path.parse(this.internalPathStr);
        return new PathUtils(currentPath.dir);
    }

    public doesExist(): boolean {
        return fs.existsSync(this.internalPathStr);
    }

    public joinPath(pathString: string): PathUtils {
        return new PathUtils(this.internalPathStr, pathString);
    }

    public createFile() {
        if (this.doesExist()) {
            return;
        }

        fs.writeFileSync(this.internalPathStr, "");
    }

    public getRelativePathString(parentDir: PathUtils): string {
        const relativePath = path.relative(
            parentDir.pathString(),
            this.internalPathStr
        );

        return relativePath.replace("\\", "/");
    }
}
