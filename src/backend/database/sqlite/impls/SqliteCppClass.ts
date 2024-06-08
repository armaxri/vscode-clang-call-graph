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
import { SqliteVirtualFuncDeclaration } from "./SqliteVirtualFuncDeclaration";
import { SqliteVirtualFuncImplementation } from "./SqliteVirtualFuncImplementation";

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
                    `INSERT INTO cpp_classes (class_name, cpp_file_id, hpp_file_id, cpp_class_id)
                     VALUES (@className, @cppFileId, @hppFileId, @cppClassId)`
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
                `SELECT id FROM cpp_classes
                 WHERE class_name=(?) AND cpp_file_id=(?) AND hpp_file_id=(?) AND cpp_class_id=(?)`
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

    getParentClasses(): CppClass[] {
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

    getClasses(): CppClass[] {
        return SqliteCppClass.getCppClasses(this.internal, {
            cppClassId: this.id,
        });
    }

    getOrAddClass(className: string): CppClass {
        const cppClass = SqliteCppClass.getCppClass(this.internal, className, {
            cppClassId: this.id,
        });

        if (cppClass) {
            return cppClass;
        }

        return SqliteCppClass.createCppClass(this.internal, className, {
            cppClassId: this.id,
        });
    }

    getFuncDecls(): FuncDeclaration[] {
        return SqliteFuncDeclaration.getFuncDecls(this.internal, {
            cppClassId: this.id,
        });
    }

    getOrAddFuncDecl(args: FuncCreationArgs): FuncDeclaration {
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

    getFuncImpls(): FuncImplementation[] {
        return SqliteFuncImplementation.getFuncImpls(this.internal, {
            cppClassId: this.id,
        });
    }

    getOrAddFuncImpl(args: FuncCreationArgs): FuncImplementation {
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

    getVirtualFuncDecls(): VirtualFuncDeclaration[] {
        return SqliteVirtualFuncDeclaration.getVirtualFuncDecls(
            this.internal,
            this.id
        );
    }

    getOrAddVirtualFuncDecl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncDeclaration {
        const virtualFuncDecl = SqliteVirtualFuncDeclaration.getVirtualFuncDecl(
            this.internal,
            args,
            this.id
        );

        if (virtualFuncDecl) {
            return virtualFuncDecl;
        }

        return SqliteVirtualFuncDeclaration.createVirtualFuncDecl(
            this.internal,
            args,
            this.id
        );
    }

    getVirtualFuncImpls(): VirtualFuncImplementation[] {
        return SqliteVirtualFuncImplementation.getVirtualFuncImpls(
            this.internal,
            {
                cppClassId: this.id,
            }
        );
    }

    getOrAddVirtualFuncImpl(
        args: VirtualFuncCreationArgs
    ): VirtualFuncImplementation {
        const virtualFuncImpl =
            SqliteVirtualFuncImplementation.getVirtualFuncImpl(
                this.internal,
                args,
                { cppClassId: this.id }
            );

        if (virtualFuncImpl) {
            return virtualFuncImpl;
        }

        return SqliteVirtualFuncImplementation.createVirtualFuncImpl(
            this.internal,
            args,
            { cppClassId: this.id }
        );
    }
}
