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
        funcName: string,
        funcAstName: string,
        qualType: string,
        range: Range
    ) {
        super();

        this.internal = internal;
        this.id = id;
        this.funcName = funcName;
        this.funcAstName = funcAstName;
        this.qualType = qualType;
        this.range = range;
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

                FOREIGN KEY (cpp_file_id) REFERENCES cpp_files(id)
            )
        `);
    }

    static createFuncDecl(
        internalDb: InternalSqliteDatabase,
        args: FuncCreationArgs,
        cppFileId: number = -1
    ): SqliteFuncDeclaration {
        const funcId = Number(
            internalDb.db
                .prepare(
                    "INSERT INTO func_declarations (func_name, func_ast_name, qual_type, range_start_line, range_start_column, range_end_line, range_end_column, cpp_file_id) VALUES (@funcName, @funcAstName, @qualType, @rangeStartLine, @rangeStartColumn, @rangeEndLine, @rangeEndColumn, @cppFileId)"
                )
                .run({
                    funcName: args.funcName,
                    funcAstName: args.funcAstName,
                    qualType: args.qualType,
                    rangeStartLine: args.range.start.line,
                    rangeStartColumn: args.range.start.column,
                    rangeEndLine: args.range.end.line,
                    rangeEndColumn: args.range.end.column,
                    cppFileId: cppFileId === -1 ? null : cppFileId,
                }).lastInsertRowid
        );

        return new SqliteFuncDeclaration(
            internalDb,
            funcId,
            args.funcName,
            args.funcAstName,
            args.qualType,
            args.range
        );
    }

    static getFuncDecl(
        internalDb: InternalSqliteDatabase,
        funcName: string,
        cppFileId: number = -1
    ): SqliteFuncDeclaration | null {
        const row = internalDb.db
            .prepare(
                "SELECT * FROM func_declarations WHERE func_name=(?) AND cpp_file_id=(?)"
            )
            .get(funcName, cppFileId === -1 ? null : cppFileId);

        if (row !== undefined) {
            return new SqliteFuncDeclaration(
                internalDb,
                (row as any).id,
                (row as any).func_name,
                (row as any).func_ast_name,
                (row as any).qual_type,
                {
                    start: {
                        line: (row as any).range_start_line,
                        column: (row as any).range_start_column,
                    },
                    end: {
                        line: (row as any).range_end_line,
                        column: (row as any).range_end_column,
                    },
                }
            );
        }

        return null;
    }

    static getFuncDecls(
        internalDb: InternalSqliteDatabase,
        cppFileId: number = -1
    ): SqliteFuncDeclaration[] {
        const funcDecls: SqliteFuncDeclaration[] = [];

        internalDb.db
            .prepare("SELECT * FROM func_declarations WHERE cpp_file_id=(?)")
            .all(cppFileId === -1 ? null : cppFileId)
            .forEach((row) => {
                funcDecls.push(
                    new SqliteFuncDeclaration(
                        internalDb,
                        (row as any).id,
                        (row as any).func_name,
                        (row as any).func_ast_name,
                        (row as any).qual_type,
                        {
                            start: {
                                line: (row as any).range_start_line,
                                column: (row as any).range_start_column,
                            },
                            end: {
                                line: (row as any).range_end_line,
                                column: (row as any).range_end_column,
                            },
                        }
                    )
                );
            });

        return funcDecls;
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
