import {
    CppClass,
    FuncDeclaration,
    FuncCreationArgs,
    FuncImplementation,
    VirtualFuncImplementation,
    VirtualFuncCreationArgs,
    File,
} from "../../cpp_structure";
import { AbstractCppFile } from "../../impls/AbstractCppFile";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";
import { SqliteCppClass } from "./SqliteCppClass";
import { SqliteFuncDeclaration } from "./SqliteFuncDeclaration";
import { SqliteFuncImplementation } from "./SqliteFuncImplementation";
import { SqliteHppFile } from "./SqliteHppFile";
import { SqliteVirtualFuncImplementation } from "./SqliteVirtualFuncImplementation";

export class SqliteCppFile extends AbstractCppFile {
    private internal: InternalSqliteDatabase;
    private id: number;

    private fileName: string;
    private lastAnalyzed: number;
    private cppClasses: CppClass[];
    private funcDecls: FuncDeclaration[];
    private funcImpls: FuncImplementation[];
    private virtualFuncImpls: VirtualFuncImplementation[];

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
            cppFileId: this.id,
        });
        this.funcDecls = SqliteFuncDeclaration.getFuncDecls(this.internal, {
            cppFileId: this.id,
        });
        this.funcImpls = SqliteFuncImplementation.getFuncImpls(this.internal, {
            cppFileId: this.id,
        });
        this.virtualFuncImpls =
            SqliteVirtualFuncImplementation.getVirtualFuncImpls(this.internal, {
                cppFileId: this.id,
            });
    }

    static createTableCalls(internalDb: InternalSqliteDatabase): void {
        internalDb.db.exec(`
            CREATE TABLE cpp_files (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                file_name     TEXT UNIQUE NOT NULL,
                last_analyzed INTEGER
            )
        `);
    }

    static createCppFile(
        internalDb: InternalSqliteDatabase,
        fileName: string
    ): SqliteCppFile {
        const creationTime = Date.now();
        const fileId = Number(
            internalDb.db
                .prepare(
                    "INSERT INTO cpp_files (file_name, last_analyzed) VALUES (@fileName, @lastAnalyzed)"
                )
                .run({ fileName: fileName, lastAnalyzed: creationTime })
                .lastInsertRowid
        );

        return new SqliteCppFile(internalDb, fileId, fileName, creationTime);
    }

    static getCppFileById(
        internalDb: InternalSqliteDatabase,
        id: number
    ): SqliteCppFile | null {
        const row = internalDb.db
            .prepare(
                "SELECT file_name, last_analyzed FROM cpp_files WHERE id=(?)"
            )
            .get(id);

        if (row !== undefined) {
            return new SqliteCppFile(
                internalDb,
                id,
                (row as any).file_name,
                (row as any).last_analyzed
            );
        }

        // istanbul ignore next
        return null;
    }

    static getCppFile(
        internalDb: InternalSqliteDatabase,
        fileName: string
    ): SqliteCppFile | null {
        const row = internalDb.db
            .prepare("SELECT id FROM cpp_files WHERE file_name=(?)")
            .get(fileName);

        if (row !== undefined) {
            return new SqliteCppFile(
                internalDb,
                (row as any).id,
                fileName,
                (row as any).last_analyzed
            );
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
                        (row as any).file_name,
                        (row as any).last_analyzed
                    )
                );
            });

        return cppFiles;
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
            .prepare("DELETE FROM cpp_files WHERE id=(?)")
            .run(this.id);
    }

    getName(): string {
        return this.fileName;
    }

    getIncludes(): File[] {
        const includes: File[] = [];

        this.internal.db
            .prepare(
                "SELECT file_name FROM hpp_files INNER JOIN cpp_files_2_hpp_files ON hpp_files.id=cpp_files_2_hpp_files.hpp_file_id WHERE cpp_file_id=(?)"
            )
            .all(this.id)
            .forEach((row) => {
                includes.push(
                    SqliteHppFile.getHppFile(
                        this.internal,
                        (row as any).file_name
                    ) as File
                );
            });

        return includes;
    }

    getLastAnalyzed(): number {
        return this.lastAnalyzed;
    }

    justAnalyzed(): void {
        this.lastAnalyzed = Date.now();

        this.internal.db
            .prepare("UPDATE cpp_files SET last_analyzed=(?) WHERE id=(?)")
            .run(this.lastAnalyzed, this.id);
    }

    getClasses(): CppClass[] {
        return this.cppClasses;
    }

    addClass(className: string): CppClass {
        const cppClass = SqliteCppClass.createCppClass(
            this.internal,
            className,
            {
                cppFileId: this.id,
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
                cppFileId: this.id,
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
                cppFileId: this.id,
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
                    cppFileId: this.id,
                }
            );
        this.virtualFuncImpls.push(virtualFuncImpl);

        return virtualFuncImpl;
    }
}
