import { FileAnalysisHandle } from "./astWalker/FileAnalysisHandle";

export abstract class UserInterface {
    private activeFileAnalysisHandles: FileAnalysisHandle[] = [];

    abstract displayError(message: string): void;

    createFileAnalysisHandle(
        fileName: string,
        command: string
    ): FileAnalysisHandle {
        const newFileAnalysisHandle = new FileAnalysisHandle(
            fileName,
            command,
            this
        );
        this.activeFileAnalysisHandles.push(newFileAnalysisHandle);
        return newFileAnalysisHandle;
    }
}
