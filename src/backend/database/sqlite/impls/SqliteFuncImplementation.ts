import {
    FuncCall,
    FuncCallCreationArgs,
    FuncCreationArgs,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
} from "../../cpp_structure";
import { AbstractFuncImplementation } from "../../impls/AbstractFuncImplementation";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";

export class SqliteFuncImplementation extends AbstractFuncImplementation {
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
            CREATE TABLE func_implementations (
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

                FOREIGN KEY (cpp_file_id) REFERENCES cpp_files(id),
                FOREIGN KEY (hpp_file_id) REFERENCES hpp_files(id)
            )
        `);
    }

    static createFuncImpl(
        internalDb: InternalSqliteDatabase,
        args: FuncCreationArgs,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
        }
    ): SqliteFuncImplementation {
        const funcId = Number(
            internalDb.db
                .prepare(
                    "INSERT INTO func_implementations (func_name, func_ast_name, qual_type, range_start_line, range_start_column, range_end_line, range_end_column, cpp_file_id, hpp_file_id) VALUES (@funcName, @funcAstName, @qualType, @rangeStartLine, @rangeStartColumn, @rangeEndLine, @rangeEndColumn, @cppFileId, @hppFileId)"
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
                }).lastInsertRowid
        );

        return new SqliteFuncImplementation(
            internalDb,
            funcId,
            args.funcName,
            args.funcAstName,
            args.qualType,
            args.range
        );
    }

    static getFuncImpl(
        internalDb: InternalSqliteDatabase,
        funcName: string,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
        }
    ): SqliteFuncImplementation | null {
        const row = internalDb.db
            .prepare(
                "SELECT * FROM func_implementations WHERE func_name=(?) AND cpp_file_id=(?) AND hpp_file_id=(?)"
            )
            .get(funcName, parent.cppFileId, parent.hppFileId);

        if (row !== undefined) {
            const implementation = new SqliteFuncImplementation(
                internalDb,
                (row as any).id,
                funcName,
                (row as any).funcAstName,
                (row as any).qualType,
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

            // TODO: Add function calls to implementation.

            return implementation;
        }

        return null;
    }

    static getFuncImpls(
        internalDb: InternalSqliteDatabase,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
        }
    ): SqliteFuncImplementation[] {
        const funcImpls: SqliteFuncImplementation[] = [];

        internalDb.db
            .prepare(
                "SELECT * FROM func_implementations WHERE cpp_file_id=(?) OR hpp_file_id=(?)"
            )
            .all(parent.cppFileId, parent.hppFileId)
            .forEach((row) => {
                const funcImpl = new SqliteFuncImplementation(
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

                // TODO: Add function calls to implementation.

                funcImpls.push(funcImpl);
            });

        return funcImpls;
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

    async getFuncCalls(): Promise<FuncCall[]> {
        // TODO: Implement
        return [];
    }

    addFuncCall(funcCall: FuncCallCreationArgs): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getVirtualFuncCalls(): Promise<VirtualFuncCall[]> {
        // TODO: Implement
        return [];
    }

    addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
