import {
    FuncBasics,
    FuncImplementation,
    Location,
    MainDeclLocation,
    Range,
} from "../cpp_structure";

export function isLocationWithinRange(
    location: Location,
    range: Range
): boolean {
    return (
        location.line >= range.start.line &&
        location.line <= range.end.line &&
        location.column >= range.start.column &&
        location.column <= range.end.column
    );
}

export function getMatchingFuncs(
    location: Location,
    main: MainDeclLocation
): FuncBasics[] {
    const matchingFuncs: FuncBasics[] = [];
    for (const cppClass of main.getClasses()) {
        matchingFuncs.push(...cppClass.getMatchingFuncs(location));
    }
    for (const funcDecl of main.getFuncDecls()) {
        if (funcDecl.matchesLocation(location)) {
            matchingFuncs.push(funcDecl);
        }
    }
    for (const funcImpl of main.getFuncImpls()) {
        matchingFuncs.push(...funcImpl.getMatchingFuncs(location));
    }
    for (const virtualFuncImpl of main.getVirtualFuncImpls()) {
        matchingFuncs.push(...virtualFuncImpl.getMatchingFuncs(location));
    }
    return matchingFuncs;
}

export function getMatchingFuncsInImpls(
    location: Location,
    impl: FuncImplementation
): FuncBasics[] {
    const matchingFuncs: FuncBasics[] = [];
    if (impl.matchesLocation(location)) {
        matchingFuncs.push(impl);
    }
    for (const funcCall of impl.getFuncCalls()) {
        if (funcCall.matchesLocation(location)) {
            matchingFuncs.push(funcCall);
        }
    }
    for (const virtualFuncCall of impl.getVirtualFuncCalls()) {
        if (virtualFuncCall.matchesLocation(location)) {
            matchingFuncs.push(virtualFuncCall);
        }
    }
    return matchingFuncs;
}
