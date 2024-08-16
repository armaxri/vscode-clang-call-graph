import * as assert from "assert";
import { getBestMatch } from "../../../../../backend/database/helper/location_helper";
import {
    File,
    FuncBasics,
    FuncType,
    Location,
    Range,
    rangeIsEqual,
} from "../../../../../backend/database/cpp_structure";
import { assertFuncEquals } from "../../../helper/database_equality";

class MockLocation implements FuncBasics {
    private range: Range;

    constructor(range: Range) {
        this.range = range;
    }

    getFile(): File | null {
        throw new Error("Method not implemented.");
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

    getFuncType(): FuncType {
        return FuncType.declaration;
    }

    isVirtual(): boolean {
        return false;
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

        assertFuncEquals(
            getBestMatch([outerRange, innerRange, mostInnerRange]),
            mostInnerRange
        );

        assertFuncEquals(
            getBestMatch([mostInnerRange, outerRange, innerRange]),
            mostInnerRange
        );

        assertFuncEquals(
            getBestMatch([innerRange, mostInnerRange, outerRange]),
            mostInnerRange
        );
    });
});
