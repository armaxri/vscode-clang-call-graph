import { Config } from "../../Config";
import { CppFile, Database, HppFile } from "../Database";
import { elementEquals } from "./equality_helper";

export abstract class AbstractDatabase implements Database {
    protected config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    abstract getCppFiles(): Promise<CppFile[]>;
    abstract hasCppFile(name: string): Promise<boolean>;
    abstract getOrAddCppFile(name: string): Promise<CppFile>;
    abstract removeCppFileAndDependingContent(name: string): Promise<void>;

    abstract getHppFiles(): Promise<HppFile[]>;
    abstract hasHppFile(name: string): Promise<boolean>;
    abstract getOrAddHppFile(name: string): Promise<HppFile>;
    abstract removeHppFileAndDependingContent(name: string): Promise<void>;

    abstract writeDatabase(): Promise<void>;
    abstract resetDatabase(): Promise<void>;

    async equals(otherInput: any): Promise<boolean> {
        const other = otherInput as Database;

        if (!other) {
            return false;
        }

        return (
            (await elementEquals<CppFile>(
                await this.getCppFiles(),
                await other.getCppFiles()
            )) &&
            (await elementEquals<HppFile>(
                await this.getHppFiles(),
                await other.getHppFiles()
            ))
        );
    }
}
