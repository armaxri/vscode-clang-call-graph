import * as assert from "assert";
import { MockUserInterface } from "../helper/MockUserInterface";

suite("MockUserInterface Test Suite", () => {
    test("simple test", () => {
        const userInterface = new MockUserInterface();
        assert.strictEqual(userInterface.loggedErrors.length, 0);
        userInterface.displayError("error");
        assert.strictEqual(userInterface.loggedErrors.length, 1);
        assert.strictEqual(userInterface.loggedErrors[0], "error");
    });
});
