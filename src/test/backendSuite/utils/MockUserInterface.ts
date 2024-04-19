import { UserInterface } from "../../../backend/UserInterface";

export class MockUserInterface implements UserInterface {
    public loggedErrors: Array<string> = new Array<string>();

    displayError(message: string): void {
        console.error(`displayError: "${message}"`);
        this.loggedErrors.push(message);
    }
}
