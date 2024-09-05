import { UserInterface } from "../UserInterface";

export class FileAnalysisHandle {
    private fileName: string;
    private command: string;
    private userInterface: UserInterface;
    private fileHandled: boolean = false;

    constructor(
        fileName: string,
        command: string,
        userInterface: UserInterface
    ) {
        this.fileName = fileName;
        this.command = command;
        this.userInterface = userInterface;
    }

    public getFileName(): string {
        return this.fileName;
    }

    public getCommand(): string {
        return this.command;
    }

    public fileHandlingCompleted(): boolean {
        return this.fileHandled;
    }

    public fileHandledSuccessfully(): void {
        this.fileHandled = true;
    }

    public handleFileParsingError(error: string): void {
        this.userInterface.displayError(
            `Error on parsing file "${this.fileName}" using command "${this.command}" resulting error message: ${error}`
        );
    }

    public handleFileWalkingError(error: string): void {
        this.userInterface.displayError(
            `Error on walking file "${this.fileName}" using command "${this.command}" resulting error message: ${error}`
        );
    }
}
