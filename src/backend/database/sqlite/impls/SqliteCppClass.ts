import {
    CppClass,
    FuncDeclaration,
    FuncCreationArgs,
    FuncImplementation,
    VirtualFuncDeclaration,
    VirtualFuncCreationArgs,
    VirtualFuncImplementation,
} from "../../cpp_structure";
import { AbstractCppClass } from "../../impls/AbstractCppClass";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";
import { SqliteFuncDeclaration } from "./SqliteFuncDeclaration";
import { SqliteFuncImplementation } from "./SqliteFuncImplementation";

export class SqliteCppClass extends AbstractCppClass {
    private internal: InternalSqliteDatabase;
    private id: number;
    private className: string;

    constructor(
        internal: InternalSqliteDatabase,
        id: number,
        className: string
    ) {
        super();

        this.internal = internal;
        this.id = id;
        this.className = className;
    }

    static createTableCalls(internalDb: InternalSqliteDatabase): void {
        internalDb.db.exec(`
            CREATE TABLE cpp_classes (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                class_name   TEXT NOT NULL,

                cpp_file_id  INTEGER NULL,
                hpp_file_id  INTEGER NULL,
                cpp_class_id INTEGER NULL,

                FOREIGN KEY (cpp_file_id) REFERENCES cpp_files(id),
                FOREIGN KEY (hpp_file_id) REFERENCES hpp_files(id),
                FOREIGN KEY (cpp_class_id) REFERENCES cpp_classes(id)
            )
        `);
    }

    static createCppClass(
        internalDb: InternalSqliteDatabase,
        className: string,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
            cppClassId?: number;
        }
    ): SqliteCppClass {
        const classId = Number(
            internalDb.db
                .prepare(
                    "INSERT INTO cpp_classes (class_name, cpp_file_id, hpp_file_id, cpp_class_id) VALUES (@className, @cppFileId, @hppFileId, @cppClassId)"
                )
                .run({
                    className,
                    cppFileId: parent.cppFileId,
                    hppFileId: parent.hppFileId,
                    cppClassId: parent.cppClassId,
                }).lastInsertRowid
        );

        return new SqliteCppClass(internalDb, classId, className);
    }

    static getCppClass(
        internalDb: InternalSqliteDatabase,
        className: string,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
            cppClassId?: number;
        }
    ): SqliteCppClass | null {
        const row = internalDb.db
            .prepare(
                "SELECT id FROM cpp_classes WHERE class_name=(?) AND cpp_file_id=(?) AND hpp_file_id=(?) AND cpp_class_id=(?)"
            )
            .get(
                className,
                parent.cppFileId,
                parent.hppFileId,
                parent.cppClassId
            );

        if (!row) {
            return null;
        }

        return new SqliteCppClass(
            internalDb,
            (row as any).id.id,
            (row as any).class_name
        );
    }

    static getCppClasses(
        internalDb: InternalSqliteDatabase,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
            cppClassId?: number;
        }
    ): SqliteCppClass[] {
        const cppClasses: SqliteCppClass[] = [];

        const rows = internalDb.db
            .prepare(
                "SELECT * FROM cpp_classes WHERE cpp_file_id=(?) OR hpp_file_id=(?) OR cpp_class_id=(?)"
            )
            .all(parent.cppFileId, parent.hppFileId, parent.cppClassId);

        rows.forEach((row) => {
            cppClasses.push(
                new SqliteCppClass(
                    internalDb,
                    (row as any).id,
                    (row as any).class_name
                )
            );
        });

        return cppClasses;
    }

    getName(): string {
        return this.className;
    }
    async getParentClasses(): Promise<CppClass[]> {
        // TODO: implement
        return [];
    }
    getParentClassNames(): string[] {
        // TODO: implement
        return [];
    }
    addParentClass(parentClass: CppClass): void {
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
        return SqliteFuncDeclaration.getFuncDecls(this.internal, {
            cppClassId: this.id,
        });
    }
    async getOrAddFuncDecl(args: FuncCreationArgs): Promise<FuncDeclaration> {
        const funcDecl = SqliteFuncDeclaration.getFuncDecl(
            this.internal,
            args.funcName,
            { cppClassId: this.id }
        );

        if (funcDecl) {
            return funcDecl;
        }

        return SqliteFuncDeclaration.createFuncDecl(this.internal, args, {
            cppClassId: this.id,
        });
    }
    async getFuncImpls(): Promise<FuncImplementation[]> {
        return SqliteFuncImplementation.getFuncImpls(this.internal, {
            cppClassId: this.id,
        });
    }
    async getOrAddFuncImpl(
        args: FuncCreationArgs
    ): Promise<FuncImplementation> {
        const funcImpl = SqliteFuncImplementation.getFuncImpl(
            this.internal,
            args.funcName,
            { cppClassId: this.id }
        );

        if (funcImpl) {
            return funcImpl;
        }

        return SqliteFuncImplementation.createFuncImpl(this.internal, args, {
            cppClassId: this.id,
        });
    }
    async getVirtualFuncDecls(): Promise<VirtualFuncDeclaration[]> {
        // TODO: implement
        return [];
    }
    getOrAddVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): Promise<VirtualFuncDeclaration> {
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
