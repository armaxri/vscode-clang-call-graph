import { Config } from "../../Config";
import { CppFile, HppFile } from "../cpp_structure";
import { AbstractDatabase } from "../impls/AbstractDatabase";
import { InternalSqliteDatabase } from "./InternalSqliteDatabase";
import { SqliteCppFile } from "./impls/SqliteCppFile";

export class SqliteDatabase extends AbstractDatabase {
    private internal: InternalSqliteDatabase;

    constructor(config: Config) {
        super(config);

        this.internal = new InternalSqliteDatabase(config);
    }

    async getCppFiles(): Promise<CppFile[]> {
        return SqliteCppFile.getCppFiles(this.internal);
    }

    async hasCppFile(name: string): Promise<boolean> {
        return SqliteCppFile.getCppFile(this.internal, name) !== null;
    }

    async getOrAddCppFile(name: string): Promise<CppFile> {
        const cppFile = SqliteCppFile.getCppFile(this.internal, name);

        if (cppFile) {
            return cppFile;
        }

        return SqliteCppFile.createCppFile(this.internal, name);
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

    async writeDatabase(): Promise<void> {
        // Nothing to do.
    }

    async resetDatabase(): Promise<void> {
        this.internal.resetDatabase();
    }
}
