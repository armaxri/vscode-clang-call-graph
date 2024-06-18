import {
    CppClass,
    CppFile,
    FuncBasics,
    FuncCreationArgs,
    FuncDeclaration,
    FuncImplementation,
    Location,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
} from "../cpp_structure";
import { elementEquals } from "../helper/equality_helper";
import { getMatchingFuncs } from "../helper/location_helper";

export abstract class AbstractCppFile implements CppFile {
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

    equals(otherInput: any): boolean {
        const other = otherInput as CppFile;

        // istanbul ignore next
        if (!other) {
            return false;
        }

        return (
            this.getName() === other.getName() &&
            // Sadly we can't compare the analyzed time.
            // this.getLastAnalyzed() === other.getLastAnalyzed()
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
