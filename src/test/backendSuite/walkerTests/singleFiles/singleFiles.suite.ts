import { addSuitesInSubDirsSuites } from "../../helper/mocha_test_helper";

suite("Single Files", () => {
    addSuitesInSubDirsSuites(__dirname);
});
