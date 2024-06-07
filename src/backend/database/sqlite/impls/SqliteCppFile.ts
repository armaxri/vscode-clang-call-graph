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

    async getClasses(): Promise<CppClass[]> {
        return SqliteCppClass.getCppClasses(this.internal, {
            cppFileId: this.id,
        });
    }

    async getOrAddClass(className: string): Promise<CppClass> {
        const cppClass = SqliteCppClass.getCppClass(this.internal, className, {
            cppFileId: this.id,
        });

        if (cppClass) {
            return cppClass;
        }

        return SqliteCppClass.createCppClass(this.internal, className, {
            cppFileId: this.id,
        });
    }

    async getFuncDecls(): Promise<FuncDeclaration[]> {
        return SqliteFuncDeclaration.getFuncDecls(this.internal, {
            cppFileId: this.id,
        });
    }

    async getOrAddFuncDecl(args: FuncCreationArgs): Promise<FuncDeclaration> {
        const funcDecl = SqliteFuncDeclaration.getFuncDecl(
            this.internal,
            args.funcName,
            { cppFileId: this.id }
        );

        if (funcDecl) {
            return funcDecl;
        }

        return SqliteFuncDeclaration.createFuncDecl(this.internal, args, {
            cppFileId: this.id,
        });
    }

    async getFuncImpls(): Promise<FuncImplementation[]> {
        return SqliteFuncImplementation.getFuncImpls(this.internal, {
            cppFileId: this.id,
        });
    }

    async getOrAddFuncImpl(
        args: FuncCreationArgs
    ): Promise<FuncImplementation> {
        const funcImpl = SqliteFuncImplementation.getFuncImpl(
            this.internal,
            args.funcName,
            { cppFileId: this.id }
        );

        if (funcImpl) {
            return funcImpl;
        }

        return SqliteFuncImplementation.createFuncImpl(this.internal, args, {
            cppFileId: this.id,
        });
    }

    async getVirtualFuncImpls(): Promise<VirtualFuncImplementation[]> {
        return SqliteVirtualFuncImplementation.getVirtualFuncImpls(
            this.internal,
            {
                cppFileId: this.id,
            }
        );
    }

    async getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): Promise<VirtualFuncImplementation> {
        const virtualFuncImpl =
            SqliteVirtualFuncImplementation.getVirtualFuncImpl(
                this.internal,
                args,
                { cppFileId: this.id }
            );

        if (virtualFuncImpl) {
            return virtualFuncImpl;
        }

        return SqliteVirtualFuncImplementation.createVirtualFuncImpl(
            this.internal,
            args,
            { cppFileId: this.id }
        );
    }
}
