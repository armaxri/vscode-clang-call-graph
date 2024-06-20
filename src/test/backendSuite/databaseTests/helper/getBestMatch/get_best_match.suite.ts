import * as assert from "assert";
import { getBestMatch } from "../../../../../backend/database/helper/location_helper";
import {
    Range,
    Ranged,
    rangeIsEqual,
} from "../../../../../backend/database/cpp_structure";

class MockLocation implements Ranged {
    private range: Range;

    constructor(range: Range) {
        this.range = range;
    }

    getRange(): Range {
        return this.range;
    }

    equals(otherInput: any): boolean {
        const other = otherInput as MockLocation;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return rangeIsEqual(this.getRange(), other.getRange());
    }
}

suite("Get best location match", () => {
    test("simple tests", () => {
        const outerRange = new MockLocation({
            start: { line: 2, column: 10 },
            end: { line: 5, column: 20 },
        });
        const innerRange = new MockLocation({
            start: { line: 3, column: 5 },
            end: { line: 4, column: 40 },
        });
        const mostInnerRange = new MockLocation({
            start: { line: 3, column: 10 },
            end: { line: 3, column: 50 },
        });

        assert.ok(
            getBestMatch([outerRange, innerRange, mostInnerRange]).equals(
                mostInnerRange
            )
        );

        assert.ok(
            getBestMatch([mostInnerRange, outerRange, innerRange]).equals(
                mostInnerRange
            )
        );

        assert.ok(
            getBestMatch([innerRange, mostInnerRange, outerRange]).equals(
                mostInnerRange
            )
        );
    });
});
