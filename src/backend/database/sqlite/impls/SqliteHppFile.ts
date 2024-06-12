import {
    CppClass,
    FuncDeclaration,
    FuncCreationArgs,
    FuncImplementation,
    VirtualFuncImplementation,
    VirtualFuncCreationArgs,
} from "../../cpp_structure";
import { AbstractHppFile } from "../../impls/AbstractHppFile";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";
import { SqliteCppClass } from "./SqliteCppClass";
import { SqliteFuncDeclaration } from "./SqliteFuncDeclaration";
import { SqliteFuncImplementation } from "./SqliteFuncImplementation";
import { SqliteVirtualFuncImplementation } from "./SqliteVirtualFuncImplementation";

export class SqliteHppFile extends AbstractHppFile {
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
            CREATE TABLE hpp_files (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name TEXT UNIQUE NOT NULL
            )
        `);
    }

    static createHppFile(
        internalDb: InternalSqliteDatabase,
        fileName: string
    ): SqliteHppFile {
        const fileId = Number(
            internalDb.db
                .prepare("INSERT INTO hpp_files (file_name) VALUES (@fileName)")
                .run({ fileName: fileName }).lastInsertRowid
        );

        return new SqliteHppFile(internalDb, fileId, fileName);
    }

    static getHppFile(
        internalDb: InternalSqliteDatabase,
        fileName: string
    ): SqliteHppFile | null {
        const row = internalDb.db
            .prepare("SELECT id FROM hpp_files WHERE file_name=(?)")
            .get(fileName);

        if (row !== undefined) {
            return new SqliteHppFile(internalDb, (row as any).id, fileName);
        }

        return null;
    }

    static getHppFiles(internalDb: InternalSqliteDatabase): SqliteHppFile[] {
        const hppFiles: SqliteHppFile[] = [];

        internalDb.db
            .prepare("SELECT * FROM hpp_files")
            .all()
            .forEach((row) => {
                hppFiles.push(
                    new SqliteHppFile(
                        internalDb,
                        (row as any).id,
                        (row as any).file_name
                    )
                );
            });

        return hppFiles;
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

    getReferencedFromCppFiles(): string[] {
        // TODO: implement
        return [];
    }

    addReferencedFromCppFile(fileName: string): void {
        throw new Error("Method not implemented.");
    }

    getClasses(): CppClass[] {
        return SqliteCppClass.getCppClasses(this.internal, {
            hppFileId: this.id,
        });
    }

    addClass(className: string): CppClass {
        return SqliteCppClass.createCppClass(this.internal, className, {
            hppFileId: this.id,
        });
    }

    getFuncDecls(): FuncDeclaration[] {
        return SqliteFuncDeclaration.getFuncDecls(this.internal, {
            hppFileId: this.id,
        });
    }

    addFuncDecl(args: FuncCreationArgs): FuncDeclaration {
        return SqliteFuncDeclaration.createFuncDecl(this.internal, args, {
            hppFileId: this.id,
        });
    }

    getFuncImpls(): FuncImplementation[] {
        return SqliteFuncImplementation.getFuncImpls(this.internal, {
            hppFileId: this.id,
        });
    }

    addFuncImpl(args: FuncCreationArgs): FuncImplementation {
        return SqliteFuncImplementation.createFuncImpl(this.internal, args, {
            hppFileId: this.id,
        });
    }

    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        return SqliteVirtualFuncImplementation.getVirtualFuncImpls(
            this.internal,
            {
                hppFileId: this.id,
            }
        );
    }

    addVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        return SqliteVirtualFuncImplementation.createVirtualFuncImpl(
            this.internal,
            args,
            { hppFileId: this.id }
        );
    }
}
