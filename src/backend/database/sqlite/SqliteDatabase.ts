import { Config } from "../../Config";
import { CppFile, HppFile } from "../cpp_structure";
import { AbstractDatabase } from "../impls/AbstractDatabase";

export class SqliteDatabase extends AbstractDatabase {
    constructor(config: Config) {
        super(config);
    }

    async getCppFiles(): Promise<CppFile[]> {
        // TODO: implement
        return [];
    }

    hasCppFile(name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getOrAddCppFile(name: string): Promise<CppFile> {
        throw new Error("Method not implemented.");
    }
    removeCppFileAndDependingContent(name: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getHppFiles(): Promise<HppFile[]> {
        // TODO: implement
        return [];
    }

    hasHppFile(name: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    getOrAddHppFile(name: string): Promise<HppFile> {
        throw new Error("Method not implemented.");
    }
    removeHppFileAndDependingContent(name: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    writeDatabase(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    resetDatabase(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
