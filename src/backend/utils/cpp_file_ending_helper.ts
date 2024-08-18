export enum FileType {
    source,
    header,
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
    }
    return FileType.header;
}
