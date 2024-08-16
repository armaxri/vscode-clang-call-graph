import {
    CppClass,
    File,
    FuncBasics,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    HppFile,
    Location,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
} from "../cpp_structure";
import { elementEquals } from "../helper/equality_helper";
import { getMatchingFuncs } from "../helper/location_helper";

export abstract class AbstractHppFile implements HppFile {
    abstract getReferencedFromFiles(): string[];
    abstract addReferencedFromFile(fileName: string): void;

    abstract getName(): string;

    abstract getIncludes(): File[];

    abstract getLastAnalyzed(): number;
    abstract justAnalyzed(): void;

    abstract getClasses(): CppClass[];
    abstract addClass(className: string): CppClass;
    getOrAddClass(className: string): CppClass {
        const foundClass = this.getClasses().find(
            (classObj) => classObj.getName() === className
        );
        if (foundClass) {
            return foundClass;
        }
        return this.addClass(className);
    }

    abstract getFuncDecls(): FuncDeclaration[];
    abstract addFuncDecl(args: FuncCreationArgs): FuncDeclaration;
    getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration {
        const foundFunc = this.getFuncDecls().find((func) =>
            func.baseEquals(args)
        );
        if (foundFunc) {
            return foundFunc;
        }
        return this.addFuncDecl(args);
    }

    abstract getFuncImpls(): FuncImplementation[];
    abstract addFuncImpl(args: FuncCreationArgs): FuncImplementation;
    getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation {
        const foundFunc = this.getFuncImpls().find((func) =>
            func.baseEquals(args)
        );
        if (foundFunc) {
            return foundFunc;
        }
        return this.addFuncImpl(args);
    }

    abstract getVirtualFuncImpls(): VirtualFuncImplementation[];
    abstract addVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation;
    getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        const foundFunc = this.getVirtualFuncImpls().find((func) =>
            func.baseEquals(args)
        );
        if (foundFunc) {
            return foundFunc;
        }
        return this.addVirtualFuncImpl(args);
    }

    findFuncDecl(func: FuncBasics): FuncBasics | null {
        var finding = this.getFuncDecls().find(
            (funcDecl) =>
                funcDecl.getFuncAstName() === func.getFuncAstName() &&
                funcDecl.getFuncName() === func.getFuncName() &&
                funcDecl.getQualType() === func.getQualType()
        );

        if (finding) {
            return finding;
        }

        this.getClasses().forEach((element) => {
            const match = element.findFuncDecl(func);
            if (match) {
                finding = match;
                return;
            }
        });

        if (finding) {
            return finding;
        }

        this.getIncludes().forEach((element) => {
            const match = element.findFuncDecl(func);
            if (match) {
                finding = match;
                return;
            }
        });

        return finding ? finding : null;
    }

    findVirtualFuncDecl(func: FuncBasics): FuncBasics | null {
        var finding: FuncBasics | undefined = undefined;

        this.getClasses().forEach((element) => {
            const match = element.findVirtualFuncDecl(func);
            if (match) {
                finding = match;
                return;
            }
        });

        if (finding) {
            return finding;
        }

        this.getIncludes().forEach((element) => {
            const match = element.findVirtualFuncDecl(func);
            if (match) {
                finding = match;
                return;
            }
        });

        return finding ? finding : null;
    }

    private referencedFromFilesEquals(otherList: string[]): boolean {
        const thisList = this.getReferencedFromFiles();

        // istanbul ignore next
        if (!otherList && !thisList) {
            return true;
        }

        var allMatched = true;

        thisList.forEach((fileName) => {
            if (!otherList.includes(fileName)) {
                console.log(`Didn't find ${fileName} in other list`);
                allMatched = false;
            }
        });

        otherList.forEach((fileName) => {
            if (!thisList.includes(fileName)) {
                console.log(`Didn't find ${fileName} in this list`);
                allMatched = false;
            }
        });

        return allMatched;
    }

    getMatchingFuncs(location: Location): FuncBasics[] {
        return getMatchingFuncs(location, this);
    }
}
