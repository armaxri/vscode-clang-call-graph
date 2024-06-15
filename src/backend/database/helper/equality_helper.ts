import { Equal } from "../cpp_structure";

export function elementEquals<E extends Equal>(
    mainData: E[],
    otherData: E[]
): boolean {
    if (mainData.length !== otherData.length) {
        return false;
    }

    if (mainData.length === 0 && otherData.length === 0) {
        return true;
    }

    var allMatched = true;
    for (const element of mainData) {
        var foundMatch = false;
        for (const otherElement of otherData) {
            if (element.equals(otherElement)) {
                foundMatch = true;
            }
        }

        if (!foundMatch) {
            console.log(`Didn't find match for ${element}`);
            allMatched = false;
        }
    }

    return allMatched;
}
