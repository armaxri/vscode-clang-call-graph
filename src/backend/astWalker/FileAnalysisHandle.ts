import { UserInterface } from "../UserInterface";

export class FileAnalysisHandle {
    private fileName: string;
    private command: string;
    private userInterface: UserInterface;
    private fileHandled: boolean = false;
    private fileHandlingSuccessfully: boolean = false;

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

    public fileWasHandledSuccessfully(): boolean {
        return this.fileHandlingSuccessfully;
    }

    public fileHandledSuccessfully(usedTime: number): void {
        this.fileHandled = true;
        this.fileHandlingSuccessfully = true;
        this.userInterface.displayError(
            `File "${this.fileName}" successfully handled using command "${this.command}" in ${usedTime} ms.`
        );
    }

    public handleFileParsingError(error: string): void {
        this.fileHandled = true;
        this.userInterface.displayError(
            `Error on parsing file "${this.fileName}" using command "${this.command}" resulting error message: ${error}`
        );
    }

    public handleFileWalkingError(error: string): void {
        this.fileHandled = true;
        this.userInterface.displayError(
            `Error on walking file "${this.fileName}" using command "${this.command}" resulting error message: ${error}`
        );
    }

    // The following function is just a fallback for internal errors that are not expected.
    // istanbul ignore next
    public logInternalError(error: string): void {
        this.fileHandled = true;
        this.userInterface.displayError(
            `Internal error on walking file "${this.fileName}" using command "${this.command}" resulting error message: ${error}`
        );
    }
}
