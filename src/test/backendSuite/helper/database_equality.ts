import assert from "assert";
import { Database, HppFile } from "../../../backend/database/Database";
import {
    CppClass,
    CppFile,
    File,
    MainDeclLocation,
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

    assert.deepEqual(
        actual
            .getFuncDecls()
            .map((func) => func.getFuncAstName())
            .sort(),
        expected
            .getFuncDecls()
            .map((func) => func.getFuncAstName())
            .sort()
    );
    assert.deepEqual(
        actual
            .getFuncImpls()
            .map((func) => func.getFuncAstName())
            .sort(),
        expected
            .getFuncImpls()
            .map((func) => func.getFuncAstName())
            .sort()
    );
    assert.deepEqual(
        actual
            .getVirtualFuncImpls()
            .map((func) => func.getFuncAstName())
            .sort(),
        expected
            .getVirtualFuncImpls()
            .map((func) => func.getFuncAstName())
            .sort()
    );

    // TODO: Deeper comparison of functions.
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

    assert.deepEqual(
        actual
            .getVirtualFuncDecls()
            .map((func) => func.getFuncAstName())
            .sort(),
        expected
            .getVirtualFuncDecls()
            .map((func) => func.getFuncAstName())
            .sort()
    );

    // TODO: Deeper comparison of virtual functions.
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
