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

    getCppFile(name: string): CppFile | null {
        return SqliteCppFile.getCppFile(this.internal, name);
    }

    getOrAddCppFile(name: string): CppFile {
        const cppFile = this.getCppFile(name);

        if (cppFile) {
            return cppFile;
        }

        return SqliteCppFile.createCppFile(this.internal, name);
    }

    removeCppFileAndDependingContent(name: string): void {
        const cppFile = SqliteCppFile.getCppFile(this.internal, name);

        if (cppFile) {
            cppFile.removeAndChildren();
        }
    }

    getHppFiles(): HppFile[] {
        return SqliteHppFile.getHppFiles(this.internal);
    }

    getHppFile(name: string): HppFile | null {
        return SqliteHppFile.getHppFile(this.internal, name);
    }

    getOrAddHppFile(name: string): HppFile {
        const hppFile = this.getHppFile(name);

        if (hppFile) {
            return hppFile;
        }

        return SqliteHppFile.createHppFile(this.internal, name);
    }

    removeHppFileAndDependingContent(name: string): void {
        const hppFile = SqliteHppFile.getHppFile(this.internal, name);

        if (hppFile) {
            hppFile.removeAndChildren();
        }
    }

    writeDatabase(): void {
        // Nothing to do.
    }

    resetDatabase(): void {
        this.internal.resetDatabase();
    }
}
