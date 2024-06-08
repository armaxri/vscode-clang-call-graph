import { Config } from "../../Config";
import { CppFile, HppFile } from "../cpp_structure";
import { AbstractDatabase } from "../impls/AbstractDatabase";
import { InternalSqliteDatabase } from "./InternalSqliteDatabase";
import { SqliteCppFile } from "./impls/SqliteCppFile";
import { SqliteHppFile } from "./impls/SqliteHppFile";

export class SqliteDatabase extends AbstractDatabase {
    private internal: InternalSqliteDatabase;

    constructor(config: Config) {
        super(config);

        this.internal = new InternalSqliteDatabase(config);
    }

    getCppFiles(): CppFile[] {
        return SqliteCppFile.getCppFiles(this.internal);
    }

    hasCppFile(name: string): boolean {
        return SqliteCppFile.getCppFile(this.internal, name) !== null;
    }

    getOrAddCppFile(name: string): CppFile {
        const cppFile = SqliteCppFile.getCppFile(this.internal, name);

        if (cppFile) {
            return cppFile;
        }

        return SqliteCppFile.createCppFile(this.internal, name);
    }

    removeCppFileAndDependingContent(name: string): void {
        throw new Error("Method not implemented.");
    }

    getHppFiles(): HppFile[] {
        return SqliteHppFile.getHppFiles(this.internal);
    }

    hasHppFile(name: string): boolean {
        return SqliteHppFile.getHppFile(this.internal, name) !== null;
    }

    getOrAddHppFile(name: string): HppFile {
        const hppFile = SqliteHppFile.getHppFile(this.internal, name);

        if (hppFile) {
            return hppFile;
        }

        return SqliteHppFile.createHppFile(this.internal, name);
    }

    removeHppFileAndDependingContent(name: string): void {
        throw new Error("Method not implemented.");
    }

    writeDatabase(): void {
        // Nothing to do.
    }

    resetDatabase(): void {
        this.internal.resetDatabase();
    }
}
