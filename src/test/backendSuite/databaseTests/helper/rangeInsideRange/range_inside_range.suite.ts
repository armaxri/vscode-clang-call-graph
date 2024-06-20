import * as assert from "assert";
import { isRangeInsideRange } from "../../../../../backend/database/helper/location_helper";

suite("Range inside range test", () => {
    test("simple tests", () => {
        assert.ok(
            isRangeInsideRange(
                { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } },
                { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } }
            )
        );
        assert.ok(
            isRangeInsideRange(
                { start: { line: 1, column: 1 }, end: { line: 2, column: 1 } },
                { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } }
            )
        );
        assert.ok(
            isRangeInsideRange(
                { start: { line: 1, column: 1 }, end: { line: 2, column: 1 } },
                { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } }
            )
        );
        assert.ok(
            isRangeInsideRange(
                { start: { line: 1, column: 1 }, end: { line: 4, column: 1 } },
                { start: { line: 2, column: 1 }, end: { line: 3, column: 1 } }
            )
        );
        assert.ok(
            isRangeInsideRange(
                { start: { line: 1, column: 10 }, end: { line: 4, column: 1 } },
                { start: { line: 2, column: 1 }, end: { line: 3, column: 1 } }
            )
        );
        assert.ok(
            isRangeInsideRange(
                { start: { line: 1, column: 1 }, end: { line: 4, column: 1 } },
                { start: { line: 2, column: 1 }, end: { line: 3, column: 10 } }
            )
        );
    });
});
