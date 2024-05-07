import { Equal } from "../cpp_structure";

export function elementEquals<E extends Equal>(
    mainData: E[],
    otherData: E[]
): boolean {
    if (mainData.length !== otherData.length) {
        return false;
    }

    var allMatched = true;
    mainData.forEach((element: E) => {
        var foundMatch = false;
        otherData.forEach((otherElement: E) => {
            if (element.equals(otherElement)) {
                foundMatch = true;
            }
        });

        if (!foundMatch) {
            console.log(`Didn't find match for ${element}`);
            allMatched = false;
        }
    });

    return allMatched;
}
