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
    private cppClasses: CppClass[];
    private funcDecls: FuncDeclaration[];
    private funcImpls: FuncImplementation[];
    private virtualFuncDecls: VirtualFuncDeclaration[];
    private virtualFuncImpls: VirtualFuncImplementation[];
    private parentClasses: CppClass[];

    constructor(
        internal: InternalSqliteDatabase,
        id: number,
        className: string
    ) {
        super();

        this.internal = internal;
        this.id = id;

        this.className = className;

        this.cppClasses = SqliteCppClass.getCppClasses(this.internal, {
            cppClassId: this.id,
        });
        this.funcDecls = SqliteFuncDeclaration.getFuncDecls(this.internal, {
            cppClassId: this.id,
        });
        this.funcImpls = SqliteFuncImplementation.getFuncImpls(this.internal, {
            cppClassId: this.id,
        });
        this.virtualFuncDecls =
            SqliteVirtualFuncDeclaration.getVirtualFuncDecls(
                this.internal,
                this.id
            );
        this.virtualFuncImpls =
            SqliteVirtualFuncImplementation.getVirtualFuncImpls(this.internal, {
                cppClassId: this.id,
            });
        this.parentClasses = this.getParentClassesInternal();
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

        internalDb.db.exec(`
            CREATE TABLE cpp_classes_2_cpp_classes (
                parent_class_id INTEGER,
                child_class_id  INTEGER,

                PRIMARY KEY (parent_class_id, child_class_id),
                FOREIGN KEY (parent_class_id) REFERENCES cpp_classes(id),
                FOREIGN KEY (child_class_id) REFERENCES cpp_classes(id)
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

    private getClassFromId(id: number): SqliteCppClass {
        const row = this.internal.db
            .prepare("SELECT * FROM cpp_classes WHERE id=(?)")
            .get(id);

        return new SqliteCppClass(
            this.internal,
            (row as any).id,
            (row as any).class_name
        );
    }

    private getParentClassesInternal(): SqliteCppClass[] {
        const parentClasses: SqliteCppClass[] = [];

        const rows = this.internal.db
            .prepare(
                `
                SELECT * FROM cpp_classes_2_cpp_classes
                WHERE child_class_id=(?)
            `
            )
            .all(this.id);

        rows.forEach((row) => {
            parentClasses.push(
                this.getClassFromId((row as any).parent_class_id)
            );
        });

        return parentClasses;
    }

    private createParentChildClassLink(
        parentClassId: number,
        childClassId: number
    ): void {
        this.internal.db
            .prepare(
                `INSERT INTO cpp_classes_2_cpp_classes (parent_class_id, child_class_id)
             VALUES (@parentClassId, @childClassId)`
            )
            .run({
                parentClassId,
                childClassId,
            });
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

        this.virtualFuncDecls.forEach((virtualFuncDecl) => {
            (
                virtualFuncDecl as SqliteVirtualFuncDeclaration
            ).removeAndChildren();
        });

        this.virtualFuncImpls.forEach((virtualFuncImpl) => {
            (
                virtualFuncImpl as SqliteVirtualFuncImplementation
            ).removeAndChildren();
        });

        this.internal.db
            .prepare("DELETE FROM cpp_classes WHERE id=(?)")
            .run(this.id);
    }

    getName(): string {
        return this.className;
    }

    getParentClasses(): CppClass[] {
        return this.parentClasses;
    }

    getParentClassNames(): string[] {
        return this.parentClasses.map((parentClass) => parentClass.getName());
    }

    addParentClass(parentClass: CppClass): void {
        this.createParentChildClassLink(
            (parentClass as SqliteCppClass).id,
            this.id
        );
        this.parentClasses.push(parentClass);
    }

    getClasses(): CppClass[] {
        return this.cppClasses;
    }

    addClass(className: string): CppClass {
        const cppClass = SqliteCppClass.createCppClass(
            this.internal,
            className,
            {
                cppClassId: this.id,
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
                cppClassId: this.id,
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
                cppClassId: this.id,
            }
        );
        this.funcImpls.push(funcImpl);

        return funcImpl;
    }

    getVirtualFuncDecls(): VirtualFuncDeclaration[] {
        return this.virtualFuncDecls;
    }

    addVirtualFuncDecl(args: VirtualFuncCreationArgs): VirtualFuncDeclaration {
        const virtualFuncDecl =
            SqliteVirtualFuncDeclaration.createVirtualFuncDecl(
                this.internal,
                args,
                this.id
            );
        this.virtualFuncDecls.push(virtualFuncDecl);

        return virtualFuncDecl;
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
                    cppClassId: this.id,
                }
            );
        this.virtualFuncImpls.push(virtualFuncImpl);

        return virtualFuncImpl;
    }
}
