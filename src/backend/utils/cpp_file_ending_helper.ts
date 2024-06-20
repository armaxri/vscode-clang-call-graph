export enum FileType {
    source,
    header,
    none,
}

export function getFileType(fileName: string): FileType {
    if (
        fileName.toLowerCase().endsWith(".cpp") ||
        fileName.toLowerCase().endsWith(".cxx") ||
        fileName.toLowerCase().endsWith(".c++") ||
        fileName.toLowerCase().endsWith(".cp") ||
        fileName.toLowerCase().endsWith(".cc") ||
        fileName.toLowerCase().endsWith(".c")
    ) {
        return FileType.source;
    } else if (
        fileName.toLowerCase().endsWith(".hpp") ||
        fileName.toLowerCase().endsWith(".h")
    ) {
        return FileType.header;
    } else {
        return FileType.none;
    }
}
