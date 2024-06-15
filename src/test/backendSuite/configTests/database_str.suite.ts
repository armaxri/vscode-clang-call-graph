import * as assert from "assert";
import {
    DatabaseType,
    convertStrToDatabaseType,
} from "../../../backend/Config";

suite("Database strings", () => {
    test("Test conversion", () => {
        assert.strictEqual(
            convertStrToDatabaseType("lowdb"),
            DatabaseType.lowdb
        );
        assert.strictEqual(
            convertStrToDatabaseType("sqlite"),
            DatabaseType.sqlite
        );
        assert.throws(() => {
            convertStrToDatabaseType("invalid");
        });
    });
});
