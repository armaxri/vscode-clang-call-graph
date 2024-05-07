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
