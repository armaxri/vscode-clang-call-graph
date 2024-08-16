import assert from "assert";
import { Database, HppFile } from "../../../backend/database/Database";
import {
    CppClass,
    CppFile,
    File,
    FuncBasics,
    FuncImplBasics,
    FuncType,
    MainDeclLocation,
    VirtualFuncBasics,
} from "../../../backend/database/cpp_structure";

export function assertDatabaseEquals(
    actual: Database,
    expected: Database
): void {
    const actualCppFiles = actual.getCppFiles();
    const expectedCppFiles = expected.getCppFiles();

    assert.deepEqual(
        actualCppFiles.map((file) => file.getName()).sort(),
        expectedCppFiles.map((file) => file.getName()).sort()
    );

    const actualHppFiles = actual.getHppFiles();
    const expectedHppFiles = expected.getHppFiles();

    assert.deepEqual(
        actualHppFiles.map((file) => file.getName()).sort(),
        expectedHppFiles.map((file) => file.getName()).sort()
    );

    actualCppFiles.forEach((actualCppFile) => {
        const expectedCppFile = expectedCppFiles.find(
            (file) => file.getName() === actualCppFile.getName()
        );
        assertCppFileEquals(actualCppFile, expectedCppFile!);
    });

    actualHppFiles.forEach((actualHppFile) => {
        const expectedHppFile = expectedHppFiles.find(
            (file) => file.getName() === actualHppFile.getName()
        );
        assertHeaderFileEquals(actualHppFile, expectedHppFile!);
    });
}

export function assertMainDeclLocationEquals(
    actual: MainDeclLocation,
    expected: MainDeclLocation
): void {
    const actualClasses = actual.getClasses();
    const expectedClasses = expected.getClasses();

    assert.deepEqual(
        actualClasses.map((classInst) => classInst.getName()).sort(),
        expectedClasses.map((classInst) => classInst.getName()).sort()
    );

    actualClasses.forEach((actualClass) => {
        const expectedClass = expectedClasses.find(
            (classInst) => classInst.getName() === actualClass.getName()
        );
        assertCppClassEquals(actualClass, expectedClass!);
    });

    const actualFuncDecls = actual.getFuncDecls();
    const expectedFuncDecls = expected.getFuncDecls();

    assert.deepEqual(
        actualFuncDecls.map((func) => func.getFuncAstName()).sort(),
        expectedFuncDecls.map((func) => func.getFuncAstName()).sort()
    );

    const actualFuncImpls = actual.getFuncImpls();
    const expectedFuncImpls = expected.getFuncImpls();

    assert.deepEqual(
        actualFuncImpls.map((func) => func.getFuncAstName()).sort(),
        expectedFuncImpls.map((func) => func.getFuncAstName()).sort()
    );

    const actualVirtualFuncImpls = actual.getVirtualFuncImpls();
    const expectedVirtualFuncImpls = expected.getVirtualFuncImpls();

    assert.deepEqual(
        actualVirtualFuncImpls.map((func) => func.getFuncAstName()).sort(),
        expectedVirtualFuncImpls.map((func) => func.getFuncAstName()).sort()
    );

    for (let i = 0; i < actualFuncDecls.length; i++) {
        assertFuncEquals(actualFuncDecls[i], expectedFuncDecls[i]);
    }

    for (let i = 0; i < actualFuncImpls.length; i++) {
        assertFuncEquals(actualFuncImpls[i], expectedFuncImpls[i]);
    }

    for (let i = 0; i < actualVirtualFuncImpls.length; i++) {
        assertFuncEquals(
            actualVirtualFuncImpls[i],
            expectedVirtualFuncImpls[i]
        );
    }
}

export function assertCppClassEquals(
    actual: CppClass,
    expected: CppClass
): void {
    assertMainDeclLocationEquals(actual, expected);

    assert.deepEqual(
        actual.getParentClassNames().sort(),
        expected.getParentClassNames().sort()
    );

    const actualVirtualFuncDecls = actual.getVirtualFuncDecls();
    const expectedVirtualFuncDecls = expected.getVirtualFuncDecls();

    assert.deepEqual(
        actualVirtualFuncDecls.map((func) => func.getFuncAstName()).sort(),
        expectedVirtualFuncDecls.map((func) => func.getFuncAstName()).sort()
    );

    for (let i = 0; i < actualVirtualFuncDecls.length; i++) {
        assertFuncEquals(
            actualVirtualFuncDecls[i],
            expectedVirtualFuncDecls[i]
        );
    }
}

export function assertFileEquals(actual: File, expected: File): void {
    assert.deepEqual(actual.getName(), expected.getName());

    // Not part of the database but should also work.
    assert.deepEqual(
        actual
            .getIncludes()
            .map((file) => file.getName())
            .sort(),
        expected
            .getIncludes()
            .map((file) => file.getName())
            .sort()
    );

    // Skip due to connection to the system clock.
    // assert.deepEqual(actual.getLastAnalyzed(), expected.getLastAnalyzed());

    assertMainDeclLocationEquals(actual, expected);
}

export function assertCppFileEquals(actual: CppFile, expected: CppFile): void {
    assertFileEquals(actual, expected);
}

export function assertHeaderFileEquals(
    actual: HppFile,
    expected: HppFile
): void {
    assertFileEquals(actual, expected);

    assert.deepEqual(
        actual.getReferencedFromFiles().sort(),
        expected.getReferencedFromFiles().sort()
    );
}

export function assertFuncEquals(
    actual: FuncBasics,
    expected: FuncBasics
): void {
    assert.deepEqual(actual.getFuncName(), expected.getFuncName());
    assert.deepEqual(actual.getFuncAstName(), expected.getFuncAstName());
    assert.deepEqual(actual.getQualType(), expected.getQualType());
    assert.deepEqual(actual.getRange(), expected.getRange());
    assert.deepEqual(actual.getFuncType(), expected.getFuncType());
    assert.deepEqual(actual.isVirtual(), expected.isVirtual());

    if (actual.isVirtual()) {
        assert.deepEqual(
            (actual as VirtualFuncBasics).getBaseFuncAstName(),
            (expected as VirtualFuncBasics).getBaseFuncAstName()
        );
    }

    if (actual.getFuncType() === FuncType.implementation) {
        const actualImpl = actual as FuncImplBasics;
        const expectedImpl = expected as FuncImplBasics;

        const sortedActualFuncCalls = sortFuncs(actualImpl.getFuncCalls());
        const sortedExpectedFuncCalls = sortFuncs(expectedImpl.getFuncCalls());

        assert.deepEqual(
            sortedActualFuncCalls.map((func) => func.getFuncAstName()).sort(),
            sortedExpectedFuncCalls.map((func) => func.getFuncAstName()).sort()
        );

        const sortedActualVirtualFuncCalls = sortFuncs(
            actualImpl.getVirtualFuncCalls()
        );
        const sortedExpectedVirtualFuncCalls = sortFuncs(
            expectedImpl.getVirtualFuncCalls()
        );

        assert.deepEqual(
            sortedActualVirtualFuncCalls
                .map((func) => func.getFuncAstName())
                .sort(),
            sortedExpectedVirtualFuncCalls
                .map((func) => func.getFuncAstName())
                .sort()
        );

        for (let i = 0; i < sortedActualFuncCalls.length; i++) {
            assertFuncEquals(
                sortedActualFuncCalls[i],
                sortedExpectedFuncCalls[i]
            );
        }

        for (let i = 0; i < sortedActualVirtualFuncCalls.length; i++) {
            assertFuncEquals(
                sortedActualVirtualFuncCalls[i],
                sortedExpectedVirtualFuncCalls[i]
            );
        }
    }
}

function sortFuncs(funcs: FuncBasics[]): FuncBasics[] {
    return funcs.sort((a, b) => {
        var compValue = a.getFuncAstName().localeCompare(b.getFuncAstName());
        if (compValue !== 0) {
            return compValue;
        }
        compValue = a.getFuncName().localeCompare(b.getFuncName());
        if (compValue !== 0) {
            return compValue;
        }
        compValue = a.getQualType().localeCompare(b.getQualType());
        if (compValue !== 0) {
            return compValue;
        }
        compValue = a.getRange().start.line - b.getRange().start.line;
        if (compValue !== 0) {
            return compValue;
        }
        compValue = a.getRange().start.column - b.getRange().start.column;
        if (compValue !== 0) {
            return compValue;
        }
        compValue = a.getRange().end.line - b.getRange().end.line;
        if (compValue !== 0) {
            return compValue;
        }
        compValue = a.getRange().end.column - b.getRange().end.column;
        if (compValue !== 0) {
            return compValue;
        }
        compValue = a.getFuncType().localeCompare(b.getFuncType());
        if (compValue !== 0) {
            return compValue;
        }
        if (a.isVirtual() && b.isVirtual()) {
            compValue = (a as VirtualFuncBasics)
                .getBaseFuncAstName()
                .localeCompare((b as VirtualFuncBasics).getBaseFuncAstName());
            if (compValue !== 0) {
                return compValue;
            }
        }

        return 0;
    });
}
