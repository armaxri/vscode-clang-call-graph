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
    private lastAnalyzed: number;
    private cppClasses: CppClass[];
    private funcDecls: FuncDeclaration[];
    private funcImpls: FuncImplementation[];
    private virtualFuncImpls: VirtualFuncImplementation[];
    private referencedFromCppFiles: string[];

    constructor(
        internal: InternalSqliteDatabase,
        id: number,
        fileName: string,
        lastAnalyzed: number
    ) {
        super();

        this.internal = internal;
        this.id = id;

        this.fileName = fileName;
        this.lastAnalyzed = lastAnalyzed;

        this.cppClasses = SqliteCppClass.getCppClasses(this.internal, {
            hppFileId: this.id,
        });
        this.funcDecls = SqliteFuncDeclaration.getFuncDecls(this.internal, {
            hppFileId: this.id,
        });
        this.funcImpls = SqliteFuncImplementation.getFuncImpls(this.internal, {
            hppFileId: this.id,
        });
        this.virtualFuncImpls =
            SqliteVirtualFuncImplementation.getVirtualFuncImpls(this.internal, {
                hppFileId: this.id,
            });
        this.referencedFromCppFiles = this.getReferencedFromCppFilesInternal();
    }

    static createTableCalls(internalDb: InternalSqliteDatabase): void {
        internalDb.db.exec(`
            CREATE TABLE hpp_files (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name     TEXT UNIQUE NOT NULL,
                last_analyzed INTEGER
            )
        `);

        internalDb.db.exec(`
            CREATE TABLE cpp_files_2_hpp_files (
                cpp_file_id INTEGER,
                hpp_file_id INTEGER,

                PRIMARY KEY (cpp_file_id, hpp_file_id),
                FOREIGN KEY (cpp_file_id) REFERENCES cpp_files (id),
                FOREIGN KEY (hpp_file_id) REFERENCES hpp_files (id)
            )
        `);
    }

    static createHppFile(
        internalDb: InternalSqliteDatabase,
        fileName: string
    ): SqliteHppFile {
        const creationTime = Date.now();
        const fileId = Number(
            internalDb.db
                .prepare(
                    "INSERT INTO hpp_files (file_name, last_analyzed) VALUES (@fileName, @lastAnalyzed)"
                )
                .run({ fileName: fileName, lastAnalyzed: creationTime })
                .lastInsertRowid
        );

        return new SqliteHppFile(internalDb, fileId, fileName, creationTime);
    }

    static getHppFile(
        internalDb: InternalSqliteDatabase,
        fileName: string
    ): SqliteHppFile | null {
        const row = internalDb.db
            .prepare("SELECT id FROM hpp_files WHERE file_name=(?)")
            .get(fileName);

        if (row !== undefined) {
            return new SqliteHppFile(
                internalDb,
                (row as any).id,
                fileName,
                (row as any).last_analyzed
            );
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
                        (row as any).file_name,
                        (row as any).last_analyzed
                    )
                );
            });

        return hppFiles;
    }

    private getReferencedFromCppFilesInternal(): string[] {
        const cppFiles: string[] = [];

        this.internal.db
            .prepare(
                "SELECT file_name FROM cpp_files_2_hpp_files INNER JOIN cpp_files ON cpp_files.id=cpp_files_2_hpp_files.cpp_file_id WHERE hpp_file_id=(?)"
            )
            .all(this.id)
            .forEach((row) => {
                cppFiles.push((row as any).file_name);
            });

        return cppFiles;
    }

    private addReferencedFromCppFileInternal(fileName: string): void {
        this.internal.db
            .prepare(
                "INSERT INTO cpp_files_2_hpp_files (cpp_file_id, hpp_file_id) VALUES ((SELECT id FROM cpp_files WHERE file_name=(?)), (?))"
            )
            .run(fileName, this.id);
    }

    removeAndChildren(): void {
        this.cppClasses.forEach((cppClass) => {
            (cppClass as SqliteCppClass).removeAndChildren();
        });

        this.funcDecls.forEach((funcDecl) => {
            (funcDecl as SqliteFuncDeclaration).removeAndChildren();
        });

        this.funcImpls.forEach((funcImpl) => {
            (funcImpl as SqliteFuncImplementation).removeAndChildren();
        });

        this.virtualFuncImpls.forEach((virtualFuncImpl) => {
            (
                virtualFuncImpl as SqliteVirtualFuncImplementation
            ).removeAndChildren();
        });

        this.internal.db
            .prepare("DELETE FROM hpp_files WHERE id=(?)")
            .run(this.id);
    }

    getName(): string {
        return this.fileName;
    }

    getLastAnalyzed(): number {
        return this.lastAnalyzed;
    }

    justAnalyzed(): void {
        this.lastAnalyzed = Date.now();

        this.internal.db
            .prepare("UPDATE hpp_files SET last_analyzed=(?) WHERE id=(?)")
            .run(this.lastAnalyzed, this.id);
    }

    getReferencedFromCppFiles(): string[] {
        return this.referencedFromCppFiles;
    }

    addReferencedFromCppFile(fileName: string): void {
        this.addReferencedFromCppFileInternal(fileName);
        this.referencedFromCppFiles.push(fileName);
    }

    getClasses(): CppClass[] {
        return this.cppClasses;
    }

    addClass(className: string): CppClass {
        const cppClass = SqliteCppClass.createCppClass(
            this.internal,
            className,
            {
                hppFileId: this.id,
            }
        );
        this.cppClasses.push(cppClass);

        return cppClass;
    }

    getFuncDecls(): FuncDeclaration[] {
        return this.funcDecls;
    }

    addFuncDecl(args: FuncCreationArgs): FuncDeclaration {
        const funcDecl = SqliteFuncDeclaration.createFuncDecl(
            this.internal,
            args,
            {
                hppFileId: this.id,
            }
        );
        this.funcDecls.push(funcDecl);

        return funcDecl;
    }

    getFuncImpls(): FuncImplementation[] {
        return this.funcImpls;
    }

    addFuncImpl(args: FuncCreationArgs): FuncImplementation {
        const funcImpl = SqliteFuncImplementation.createFuncImpl(
            this.internal,
            args,
            {
                hppFileId: this.id,
            }
        );
        this.funcImpls.push(funcImpl);

        return funcImpl;
    }

    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        return this.virtualFuncImpls;
    }

    addVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        const virtualFuncImpl =
            SqliteVirtualFuncImplementation.createVirtualFuncImpl(
                this.internal,
                args,
                {
                    hppFileId: this.id,
                }
            );
        this.virtualFuncImpls.push(virtualFuncImpl);

        return virtualFuncImpl;
    }
}
