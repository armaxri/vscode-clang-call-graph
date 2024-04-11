import { IUserInterface } from "../../../backend/IUserInterface";

export class MockUserInterface implements IUserInterface {
    public loggedErrors: Array<string> = new Array<string>();

    displayError(message: string): void {
        console.error(`displayError: "${message}"`);
        this.loggedErrors.push(message);
    }
}
