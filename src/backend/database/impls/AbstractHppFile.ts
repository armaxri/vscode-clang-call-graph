import {
    CppClass,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    HppFile,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
} from "../cpp_structure";
import { elementEquals } from "../helper/equality_helper";

export abstract class AbstractHppFile implements HppFile {
    abstract getReferencedFromCppFiles(): string[];
    abstract addReferencedFromCppFile(fileName: string): void;
    abstract getName(): string;
    abstract getLastAnalyzed(): number;
    abstract justAnalyzed(): void;
    abstract getClasses(): CppClass[];
    abstract getOrAddClass(className: string): CppClass;
    abstract getFuncDecls(): FuncDeclaration[];
    abstract getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration;
    abstract getFuncImpls(): FuncImplementation[];
    abstract getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation;
    abstract getVirtualFuncImpls(): VirtualFuncImplementation[];
    abstract getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation;

    private referencedFromCppFilesEquals(otherList: string[]): boolean {
        const thisList = this.getReferencedFromCppFiles();

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
}
