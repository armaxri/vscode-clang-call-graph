import {
    CppClass,
    FuncDeclaration,
    FuncCreationArgs,
    FuncImplementation,
    VirtualFuncImplementation,
    VirtualFuncCreationArgs,
} from "../../cpp_structure";
import { AbstractCppFile } from "../../impls/AbstractCppFile";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";
import { SqliteCppClass } from "./SqliteCppClass";
import { SqliteFuncDeclaration } from "./SqliteFuncDeclaration";
import { SqliteFuncImplementation } from "./SqliteFuncImplementation";
import { SqliteVirtualFuncImplementation } from "./SqliteVirtualFuncImplementation";

export class SqliteCppFile extends AbstractCppFile {
    private internal: InternalSqliteDatabase;
    private id: number;
    private fileName: string;

    constructor(
        internal: InternalSqliteDatabase,
        id: number,
        fileName: string
    ) {
        super();

        this.internal = internal;
        this.id = id;
        this.fileName = fileName;
    }

    static createTableCalls(internalDb: InternalSqliteDatabase): void {
        internalDb.db.exec(`
            CREATE TABLE cpp_files (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name TEXT UNIQUE NOT NULL
            )
        `);
    }

    static createCppFile(
        internalDb: InternalSqliteDatabase,
        fileName: string
    ): SqliteCppFile {
        const fileId = Number(
            internalDb.db
                .prepare("INSERT INTO cpp_files (file_name) VALUES (@fileName)")
                .run({ fileName: fileName }).lastInsertRowid
        );

        return new SqliteCppFile(internalDb, fileId, fileName);
    }

    static getCppFile(
        internalDb: InternalSqliteDatabase,
        fileName: string
    ): SqliteCppFile | null {
        const row = internalDb.db
            .prepare("SELECT id FROM cpp_files WHERE file_name=(?)")
            .get(fileName);

        if (row !== undefined) {
            return new SqliteCppFile(internalDb, (row as any).id, fileName);
        }

        return null;
    }

    static getCppFiles(internalDb: InternalSqliteDatabase): SqliteCppFile[] {
        const cppFiles: SqliteCppFile[] = [];

        internalDb.db
            .prepare("SELECT * FROM cpp_files")
            .all()
            .forEach((row) => {
                cppFiles.push(
                    new SqliteCppFile(
                        internalDb,
                        (row as any).id,
                        (row as any).file_name
                    )
                );
            });

        return cppFiles;
    }

    getName(): string {
        return this.fileName;
    }

    getLastAnalyzed(): number {
        throw new Error("Method not implemented.");
    }

    justAnalyzed(): void {
        throw new Error("Method not implemented.");
    }

    getClasses(): CppClass[] {
        return SqliteCppClass.getCppClasses(this.internal, {
            cppFileId: this.id,
        });
    }

    addClass(className: string): CppClass {
        return SqliteCppClass.createCppClass(this.internal, className, {
            cppFileId: this.id,
        });
    }

    getFuncDecls(): FuncDeclaration[] {
        return SqliteFuncDeclaration.getFuncDecls(this.internal, {
            cppFileId: this.id,
        });
    }

    addFuncDecl(args: FuncCreationArgs): FuncDeclaration {
        return SqliteFuncDeclaration.createFuncDecl(this.internal, args, {
            cppFileId: this.id,
        });
    }

    getFuncImpls(): FuncImplementation[] {
        return SqliteFuncImplementation.getFuncImpls(this.internal, {
            cppFileId: this.id,
        });
    }

    addFuncImpl(args: FuncCreationArgs): FuncImplementation {
        return SqliteFuncImplementation.createFuncImpl(this.internal, args, {
            cppFileId: this.id,
        });
    }

    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        return SqliteVirtualFuncImplementation.getVirtualFuncImpls(
            this.internal,
            {
                cppFileId: this.id,
            }
        );
    }

    addVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        return SqliteVirtualFuncImplementation.createVirtualFuncImpl(
            this.internal,
            args,
            { cppFileId: this.id }
        );
    }
}
