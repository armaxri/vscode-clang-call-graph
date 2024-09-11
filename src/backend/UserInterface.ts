import { FileAnalysisHandle } from "./astWalker/FileAnalysisHandle";
import { Config } from "./Config";

export abstract class UserInterface {
    private activeFileAnalysisHandles: FileAnalysisHandle[] = [];
    protected config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    abstract logError(message: string): void;

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
