import assert from "assert";
import { CancellationToken } from "../../../../backend/functionSearch/CancellationToken";
import { addSuitesInSubDirsSuites } from "../../helper/mocha_test_helper";

suite("Cancelation Token", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("Very simple test", () => {
        const token = new CancellationToken();

        assert.equal(token.isCancelled(), false);

        token.cancel();

        assert.equal(token.isCancelled(), true);
    });
});
