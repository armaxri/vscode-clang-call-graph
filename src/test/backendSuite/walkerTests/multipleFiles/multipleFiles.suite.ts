import { addSuitesInSubDirsSuites } from "../../helper/mocha_test_helper";

suite("Multiple Files", () => {
    addSuitesInSubDirsSuites(__dirname);
});
