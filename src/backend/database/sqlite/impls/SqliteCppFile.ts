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

    getName(): string {
        return this.fileName;
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
