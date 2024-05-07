import { Equal } from "../cpp_structure";

export async function elementEquals<E extends Equal>(
    mainData: E[],
    otherData: E[]
): Promise<boolean> {
    if (mainData.length !== otherData.length) {
        return false;
    }

    var allMatched = true;
    for (const element of mainData) {
        var foundMatch = false;
        for (const otherElement of otherData) {
            if (await element.equals(otherElement)) {
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
