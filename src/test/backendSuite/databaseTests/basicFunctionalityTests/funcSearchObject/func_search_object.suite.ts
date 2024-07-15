import assert from "assert";
import { addSuitesInSubDirsSuites } from "../../../helper/mocha_test_helper";
import { FuncSearchObject } from "../../../../../backend/database/FuncSearchObject";
import {
    CppClass,
    File,
    FuncBasics,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    FuncType,
    Location,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
} from "../../../../../backend/database/cpp_structure";

class MockFile implements File {
    public fileName: string;

    constructor(fileName: string) {
        this.fileName = fileName;
    }

    getName(): string {
        return this.fileName;
    }
    getIncludes(): File[] {
        throw new Error("Method not implemented.");
    }
    getLastAnalyzed(): number {
        throw new Error("Method not implemented.");
    }
    justAnalyzed(): void {
        throw new Error("Method not implemented.");
    }
    getClasses(): CppClass[] {
        throw new Error("Method not implemented.");
    }
    addClass(className: string): CppClass {
        throw new Error("Method not implemented.");
    }
    getOrAddClass(className: string): CppClass {
        throw new Error("Method not implemented.");
    }
    getFuncDecls(): FuncDeclaration[] {
        throw new Error("Method not implemented.");
    }
    addFuncDecl(args: FuncCreationArgs): FuncDeclaration {
        throw new Error("Method not implemented.");
    }
    getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration {
        throw new Error("Method not implemented.");
    }
    getFuncImpls(): FuncImplementation[] {
        throw new Error("Method not implemented.");
    }
    addFuncImpl(args: FuncCreationArgs): FuncImplementation {
        throw new Error("Method not implemented.");
    }
    getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation {
        throw new Error("Method not implemented.");
    }
    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        throw new Error("Method not implemented.");
    }
    addVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        throw new Error("Method not implemented.");
    }
    getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        throw new Error("Method not implemented.");
    }
    equals(other: any): boolean {
        throw new Error("Method not implemented.");
    }
    getMatchingFuncs(location: Location): FuncBasics[] {
        throw new Error("Method not implemented.");
    }
    findFuncDecl(func: FuncBasics): FuncBasics | null {
        throw new Error("Method not implemented.");
    }
    findVirtualFuncDecl(func: FuncBasics): FuncBasics | null {
        throw new Error("Method not implemented.");
    }
}

suite("Func Search Object", () => {
    addSuitesInSubDirsSuites(__dirname);

    test("Simple creation", () => {
        const file = new MockFile("file");
        const range = {
            start: { line: 2, column: 2 },
            end: { line: 2, column: 2 },
        };

        const funcSearchObject = new FuncSearchObject({
            funcName: "func",
            funcAstName: "astFunc",
            baseFuncAstName: "baseAstFunc",
            qualType: "int",
            range: range,
            file: file,
            funcType: FuncType.call,
            isVirtual: true,
        });

        assert.equal(funcSearchObject.getFuncName(), "func");
        assert.equal(funcSearchObject.getFuncAstName(), "astFunc");
        assert.equal(funcSearchObject.getBaseFuncAstName(), "baseAstFunc");
        assert.equal(funcSearchObject.getQualType(), "int");
        assert.equal(funcSearchObject.getRange().start.line, range.start.line);
        assert.equal(
            funcSearchObject.getRange().start.column,
            range.start.column
        );
        assert.equal(funcSearchObject.getRange().end.line, range.end.line);
        assert.equal(funcSearchObject.getRange().end.column, range.end.column);
        assert.equal(funcSearchObject.getFile(), file);
        assert.equal(funcSearchObject.getFuncType(), FuncType.call);
        assert.equal(funcSearchObject.isVirtual(), true);
    });

    test("Simple creation default values", () => {
        const range = {
            start: { line: 0, column: 0 },
            end: { line: 0, column: 0 },
        };

        const funcSearchObject = new FuncSearchObject({});

        assert.equal(funcSearchObject.getFuncName(), "");
        assert.equal(funcSearchObject.getFuncAstName(), "");
        assert.equal(funcSearchObject.getBaseFuncAstName(), "");
        assert.equal(funcSearchObject.getQualType(), "");
        assert.equal(funcSearchObject.getRange().start.line, range.start.line);
        assert.equal(
            funcSearchObject.getRange().start.column,
            range.start.column
        );
        assert.equal(funcSearchObject.getRange().end.line, range.end.line);
        assert.equal(funcSearchObject.getRange().end.column, range.end.column);
        assert.equal(funcSearchObject.getFile(), null);
        assert.equal(funcSearchObject.getFuncType(), FuncType.declaration);
        assert.equal(funcSearchObject.isVirtual(), false);
    });

    test("Not implemented funcs", () => {
        const funcSearchObject = new FuncSearchObject({});

        assert.throws(() => {
            funcSearchObject.matchesLocation({ line: 0, column: 0 });
        });

        assert.throws(() => {
            funcSearchObject.baseEquals(null);
        });

        assert.throws(() => {
            funcSearchObject.equals(null);
        });
    });
});
