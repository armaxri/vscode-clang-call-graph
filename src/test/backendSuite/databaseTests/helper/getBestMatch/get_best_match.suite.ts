import * as assert from "assert";
import { getBestMatch } from "../../../../../backend/database/helper/location_helper";
import {
    FuncBasics,
    Location,
    Range,
    rangeIsEqual,
} from "../../../../../backend/database/cpp_structure";

class MockLocation implements FuncBasics {
    private range: Range;

    constructor(range: Range) {
        this.range = range;
    }

    getFuncName(): string {
        return "";
    }

    getFuncAstName(): string {
        return "";
    }

    getQualType(): string {
        return "";
    }

    getRange(): Range {
        return this.range;
    }

    matchesLocation(location: Location): boolean {
        throw new Error("Method not implemented.");
    }

    baseEquals(otherInput: any): boolean {
        throw new Error("Method not implemented.");
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
