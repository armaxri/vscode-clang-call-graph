import { UserInterface } from "../../../backend/UserInterface";

export class MockUserInterface extends UserInterface {
    public loggedErrors: string[] = [];

    displayError(message: string): void {
        console.error(`displayError: "${message}"`);
        this.loggedErrors.push(message);
    }
}
