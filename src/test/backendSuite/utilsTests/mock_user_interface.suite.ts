import * as assert from "assert";
import { MockUserInterface } from "../helper/MockUserInterface";
import { MockConfig } from "../helper/MockConfig";

suite("MockUserInterface Test Suite", () => {
    test("simple test", () => {
        const config = new MockConfig(__dirname);
        const userInterface = new MockUserInterface(config);
        assert.strictEqual(userInterface.loggedErrors.length, 0);
        userInterface.logError("error");
        assert.strictEqual(userInterface.loggedErrors.length, 1);
        assert.strictEqual(userInterface.loggedErrors[0], "error");
    });
});
