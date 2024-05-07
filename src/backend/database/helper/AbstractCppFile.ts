import {
    CppClass,
    CppFile,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
} from "../cpp_structure";
import { elementEquals } from "./equality_helper";

export abstract class AbstractCppFile implements CppFile {
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

    async equals(otherInput: any): Promise<boolean> {
        const other = otherInput as CppFile;

        if (!other) {
            return false;
        }

        return (
            this.getName() === other.getName() &&
            // Sadly we can't compare the analyzed time.
            // this.getLastAnalyzed() === other.getLastAnalyzed()
            (await elementEquals<CppClass>(
                this.getClasses(),
                other.getClasses()
            )) &&
            (await elementEquals<FuncDeclaration>(
                this.getFuncDecls(),
                other.getFuncDecls()
            )) &&
            (await elementEquals<FuncImplementation>(
                this.getFuncImpls(),
                other.getFuncImpls()
            )) &&
            (await elementEquals<VirtualFuncImplementation>(
                this.getVirtualFuncImpls(),
                other.getVirtualFuncImpls()
            ))
        );
    }
}
