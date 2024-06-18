import {
    CppClass,
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
    abstract getReferencedFromCppFiles(): string[];
    abstract addReferencedFromCppFile(fileName: string): void;
    abstract getName(): string;
    abstract getLastAnalyzed(): number;
    abstract justAnalyzed(): void;
    abstract getClasses(): CppClass[];
    abstract addClass(className: string): CppClass;
    abstract getFuncDecls(): FuncDeclaration[];
    abstract addFuncDecl(args: FuncCreationArgs): FuncDeclaration;
    abstract getFuncImpls(): FuncImplementation[];
    abstract addFuncImpl(args: FuncCreationArgs): FuncImplementation;
    abstract getVirtualFuncImpls(): VirtualFuncImplementation[];
    abstract addVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation;

    private referencedFromCppFilesEquals(otherList: string[]): boolean {
        const thisList = this.getReferencedFromCppFiles();

        // istanbul ignore next
        if (!otherList && !thisList) {
            return true;
        }

        if (!otherList || !thisList || thisList.length !== otherList.length) {
            return false;
        }

        return (
            thisList.every((fileName) => otherList.includes(fileName)) &&
            otherList.every((fileName) => thisList.includes(fileName))
        );
    }

    equals(otherInput: any): boolean {
        const other = otherInput as HppFile;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return (
            this.getName() === other.getName() &&
            // Sadly we can't compare the analyzed time.
            // this.getLastAnalyzed() === other.getLastAnalyzed() &&
            this.referencedFromCppFilesEquals(
                other.getReferencedFromCppFiles()
            ) &&
            elementEquals<CppClass>(this.getClasses(), other.getClasses()) &&
            elementEquals<FuncDeclaration>(
                this.getFuncDecls(),
                other.getFuncDecls()
            ) &&
            elementEquals<FuncImplementation>(
                this.getFuncImpls(),
                other.getFuncImpls()
            ) &&
            elementEquals<VirtualFuncImplementation>(
                this.getVirtualFuncImpls(),
                other.getVirtualFuncImpls()
            )
        );
    }

    getMatchingFuncs(location: Location): FuncBasics[] {
        return getMatchingFuncs(location, this);
    }
}
