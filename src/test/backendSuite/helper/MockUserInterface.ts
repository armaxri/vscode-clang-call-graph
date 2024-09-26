import { UserInterface } from "../../../backend/UserInterface";

export class MockUserInterface extends UserInterface {
    public loggedErrors: string[] = [];
    public displayedErrors: string[] = [];

    logError(message: string): void {
        console.error(`loggedError: "${message}"`);
        this.loggedErrors.push(message);
    }

    displayError(message: string): void {
        console.error(`displayError: "${message}"`);
        this.displayedErrors.push(message);
    }
}
