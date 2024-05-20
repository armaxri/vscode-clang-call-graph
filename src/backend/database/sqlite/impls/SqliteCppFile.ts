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

    static createTableCall(internalDb: InternalSqliteDatabase): void {
        internalDb.db.exec(`
            CREATE TABLE cpp_files (
                file_name TEXT UNIQUE NOT NULL
            )
        `);
    }

    static async createCppFile(
        internalDb: InternalSqliteDatabase,
        fileName: string
    ): Promise<SqliteCppFile> {
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
            .prepare("SELECT rowid AS id FROM cpp_files WHERE file_name=(?)")
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
        // TODO: implement
        return [];
    }

    getOrAddClass(className: string): Promise<CppClass> {
        throw new Error("Method not implemented.");
    }

    async getFuncDecls(): Promise<FuncDeclaration[]> {
        // TODO: implement
        return [];
    }

    getOrAddFuncDecl(args: FuncCreationArgs): Promise<FuncDeclaration> {
        throw new Error("Method not implemented.");
    }

    async getFuncImpls(): Promise<FuncImplementation[]> {
        // TODO: implement
        return [];
    }

    getOrAddFuncImpl(args: FuncCreationArgs): Promise<FuncImplementation> {
        throw new Error("Method not implemented.");
    }

    async getVirtualFuncImpls(): Promise<VirtualFuncImplementation[]> {
        // TODO: implement
        return [];
    }

    getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): Promise<VirtualFuncImplementation> {
        throw new Error("Method not implemented.");
    }
}
