import { FuncCreationArgs, Range } from "../../cpp_structure";
import { AbstractFuncDeclaration } from "../../impls/AbstractFuncDeclaration";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";

export class SqliteFuncDeclaration extends AbstractFuncDeclaration {
    private internal: InternalSqliteDatabase;
    private id: number;

    private funcName: string;
    private funcAstName: string;
    private qualType: string;
    private range: Range;

    constructor(
        internal: InternalSqliteDatabase,
        id: number,
        args: FuncCreationArgs
    ) {
        super();

        this.internal = internal;
        this.id = id;
        this.funcName = args.funcName;
        this.funcAstName = args.funcAstName;
        this.qualType = args.qualType;
        this.range = args.range;
    }

    static createTableCalls(internalDb: InternalSqliteDatabase): void {
        internalDb.db.exec(`
            CREATE TABLE func_declarations (
                id                 INTEGER PRIMARY KEY AUTOINCREMENT,
                func_name          TEXT NOT NULL,
                func_ast_name      TEXT NOT NULL,
                qual_type          TEXT NOT NULL,
                range_start_line   INTEGER,
                range_start_column INTEGER,
                range_end_line     INTEGER,
                range_end_column   INTEGER,

                cpp_file_id        INTEGER NULL,
                hpp_file_id        INTEGER NULL,
                cpp_class_id       INTEGER NULL,

                FOREIGN KEY (cpp_file_id) REFERENCES cpp_files(id),
                FOREIGN KEY (hpp_file_id) REFERENCES hpp_files(id),
                FOREIGN KEY (cpp_class_id) REFERENCES cpp_classes(id)
            )
        `);
    }

    static createFuncDecl(
        internalDb: InternalSqliteDatabase,
        args: FuncCreationArgs,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
            cppClassId?: number;
        }
    ): SqliteFuncDeclaration {
        const funcId = Number(
            internalDb.db
                .prepare(
                    `
                    INSERT INTO func_declarations (func_name, func_ast_name, qual_type, range_start_line, range_start_column, range_end_line,
                        range_end_column, cpp_file_id, hpp_file_id, cpp_class_id)
                    VALUES (@funcName, @funcAstName, @qualType, @rangeStartLine, @rangeStartColumn, @rangeEndLine, @rangeEndColumn, @cppFileId,
                        @hppFileId, @cppClassId)`
                )
                .run({
                    funcName: args.funcName,
                    funcAstName: args.funcAstName,
                    qualType: args.qualType,
                    rangeStartLine: args.range.start.line,
                    rangeStartColumn: args.range.start.column,
                    rangeEndLine: args.range.end.line,
                    rangeEndColumn: args.range.end.column,
                    cppFileId: parent.cppFileId,
                    hppFileId: parent.hppFileId,
                    cppClassId: parent.cppClassId,
                }).lastInsertRowid
        );

        return new SqliteFuncDeclaration(internalDb, funcId, args);
    }

    static getFuncDecls(
        internalDb: InternalSqliteDatabase,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
            cppClassId?: number;
        }
    ): SqliteFuncDeclaration[] {
        const funcDecls: SqliteFuncDeclaration[] = [];

        internalDb.db
            .prepare(
                "SELECT * FROM func_declarations WHERE cpp_file_id=(?) OR hpp_file_id=(?) OR cpp_class_id=(?)"
            )
            .all(parent.cppFileId, parent.hppFileId, parent.cppClassId)
            .forEach((row) => {
                funcDecls.push(
                    new SqliteFuncDeclaration(internalDb, (row as any).id, {
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
                    })
                );
            });

        return funcDecls;
    }

    removeAndChildren(): void {
        this.internal.db
            .prepare("DELETE FROM func_declarations WHERE id=(?)")
            .run(this.id);
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
