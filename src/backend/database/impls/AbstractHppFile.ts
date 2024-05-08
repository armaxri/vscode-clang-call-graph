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
    abstract getClasses(): Promise<CppClass[]>;
    abstract getOrAddClass(className: string): Promise<CppClass>;
    abstract getFuncDecls(): Promise<FuncDeclaration[]>;
    abstract getOrAddFuncDecl(args: FuncCreationArgs): Promise<FuncDeclaration>;
    abstract getFuncImpls(): Promise<FuncImplementation[]>;
    abstract getOrAddFuncImpl(
        args: FuncCreationArgs
    ): Promise<FuncImplementation>;
    abstract getVirtualFuncImpls(): Promise<VirtualFuncImplementation[]>;
    abstract getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): Promise<VirtualFuncImplementation>;

    private referencedFromCppFilesEquals(otherList: string[]): boolean {
        const thisList = this.getReferencedFromCppFiles();

        if (thisList.length !== otherList.length) {
            return false;
        }

        return (
            thisList.every((fileName) => otherList.includes(fileName)) &&
            otherList.every((fileName) => thisList.includes(fileName))
        );
    }

    async equals(otherInput: any): Promise<boolean> {
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
            (await elementEquals<CppClass>(
                await this.getClasses(),
                await other.getClasses()
            )) &&
            (await elementEquals<FuncDeclaration>(
                await this.getFuncDecls(),
                await other.getFuncDecls()
            )) &&
            (await elementEquals<FuncImplementation>(
                await this.getFuncImpls(),
                await other.getFuncImpls()
            )) &&
            (await elementEquals<VirtualFuncImplementation>(
                await this.getVirtualFuncImpls(),
                await other.getVirtualFuncImpls()
            ))
        );
    }
}
