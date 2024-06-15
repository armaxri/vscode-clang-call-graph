import { AbstractVirtualFuncDeclaration } from "../../impls/AbstractVirtualFuncDeclaration";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";
import { Range, VirtualFuncCreationArgs } from "../../cpp_structure";

export class SqliteVirtualFuncDeclaration extends AbstractVirtualFuncDeclaration {
    private internal: InternalSqliteDatabase;
    private id: number;

    private funcName: string;
    private baseFuncAstName: string;
    private funcAstName: string;
    private qualType: string;
    private range: Range;

    constructor(
        internal: InternalSqliteDatabase,
        id: number,
        args: VirtualFuncCreationArgs
    ) {
        super();

        this.internal = internal;
        this.id = id;

        this.baseFuncAstName = args.baseFuncAstName;
        this.funcName = args.funcName;
        this.funcAstName = args.funcAstName;
        this.qualType = args.qualType;
        this.range = args.range;
    }

    static createTableCalls(internalDb: InternalSqliteDatabase): void {
        internalDb.db.exec(`
            CREATE TABLE virtual_func_declarations (
                id                 INTEGER PRIMARY KEY AUTOINCREMENT,
                base_func_ast_name TEXT NOT NULL,
                func_name          TEXT NOT NULL,
                func_ast_name      TEXT NOT NULL,
                qual_type          TEXT NOT NULL,
                range_start_line   INTEGER,
                range_start_column INTEGER,
                range_end_line     INTEGER,
                range_end_column   INTEGER,

                cpp_class_id       INTEGER NULL,

                FOREIGN KEY (cpp_class_id) REFERENCES cpp_classes(id)
            )
        `);
    }

    static createVirtualFuncDecl(
        internalDb: InternalSqliteDatabase,
        args: VirtualFuncCreationArgs,
        cppClassId: number
    ): SqliteVirtualFuncDeclaration {
        const fileId = Number(
            internalDb.db
                .prepare(
                    `
                    INSERT INTO virtual_func_declarations (base_func_ast_name, func_name,func_ast_name, qual_type,
                        range_start_line, range_start_column, range_end_line, range_end_column, cpp_class_id)
                    VALUES (@baseFuncAstName, @funcName, @funcAstName, @qualType, @rangeStartLine, @rangeStartColumn,
                        @rangeEndLine, @rangeEndColumn, @cppClassId)`
                )
                .run({
                    baseFuncAstName: args.baseFuncAstName,
                    funcName: args.funcName,
                    funcAstName: args.funcAstName,
                    qualType: args.qualType,
                    rangeStartLine: args.range.start.line,
                    rangeStartColumn: args.range.start.column,
                    rangeEndLine: args.range.end.line,
                    rangeEndColumn: args.range.end.column,
                    cppClassId: cppClassId,
                }).lastInsertRowid
        );

        return new SqliteVirtualFuncDeclaration(internalDb, fileId, args);
    }

    static getVirtualFuncDecls(
        internalDb: InternalSqliteDatabase,
        cppClassId: number
    ): SqliteVirtualFuncDeclaration[] {
        const virtualFuncDecls: SqliteVirtualFuncDeclaration[] = [];

        internalDb.db
            .prepare(
                "SELECT * FROM virtual_func_declarations WHERE cpp_class_id=(?)"
            )
            .all(cppClassId)
            .forEach((row) => {
                virtualFuncDecls.push(
                    new SqliteVirtualFuncDeclaration(
                        internalDb,
                        (row as any).id,
                        {
                            baseFuncAstName: (row as any).base_func_ast_name,
                            funcName: (row as any).func_name,
                            funcAstName: (row as any).func_ast_name,
                            qualType: (row as any).qual_type,
                            range: {
                                start: {
                                    line: (row as any).range_start_line,
                                    column: (row as any).range_start_column,
                                },
                                end: {
                                    line: (row as any).range_end_line,
                                    column: (row as any).range_end_column,
                                },
                            },
                        }
                    )
                );
            });

        return virtualFuncDecls;
    }

    removeAndChildren(): void {
        this.internal.db
            .prepare("DELETE FROM virtual_func_declarations WHERE id=(?)")
            .run(this.id);
    }

    getBaseFuncAstName(): string {
        return this.baseFuncAstName;
    }

    getFuncName(): string {
        return this.funcName;
    }

    getFuncAstName(): string {
        return this.funcAstName;
    }

    getQualType(): string {
        return this.qualType;
    }

    getRange(): Range {
        return this.range;
    }
}
