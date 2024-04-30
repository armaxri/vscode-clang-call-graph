import { Config } from "../../Config";
import { CppFile, Database, HppFile } from "../Database";

export abstract class AbstractDatabase implements Database {
    protected config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    abstract getCppFiles(): CppFile[];
    abstract hasCppFile(name: string): boolean;
    abstract getOrAddCppFile(name: string): CppFile;
    abstract removeCppFileAndDependingContent(name: string): void;

    abstract getHppFiles(): CppFile[];
    abstract hasHppFile(name: string): boolean;
    abstract getOrAddHppFile(name: string): HppFile;
    abstract removeHppFileAndDependingContent(name: string): void;

    abstract writeDatabase(): void;
    abstract resetDatabase(): void;

    equals(otherInput: any): boolean {
        const other = otherInput as Database;

        if (!other) {
            return false;
        }

        return (
            this.getCppFiles().every((cppFile) =>
                other
                    .getCppFiles()
                    .some((otherCppFile) => cppFile.equals(otherCppFile))
            ) &&
                other
                    .getCppFiles()
                    .every((otherCppFile) =>
                        this.getCppFiles().some((cppFile) =>
                            cppFile.equals(otherCppFile)
                        )
                    ),
            this.getHppFiles().every((hppFile) =>
                other
                    .getHppFiles()
                    .some((otherHppFile) => hppFile.equals(otherHppFile))
            ) &&
                other
                    .getHppFiles()
                    .every((otherHppFile) =>
                        this.getHppFiles().some((hppFile) =>
                            hppFile.equals(otherHppFile)
                        )
                    )
        );
    }
}
