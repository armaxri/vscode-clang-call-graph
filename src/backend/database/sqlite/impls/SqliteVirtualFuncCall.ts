import {
    File,
    FuncBasics,
    Range,
    VirtualFuncBasics,
    VirtualFuncCreationArgs,
} from "../../cpp_structure";
import { AbstractVirtualFuncCall } from "../../impls/AbstractVirtualFuncCall";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";
import { SqliteFuncImplementation } from "./SqliteFuncImplementation";
import { SqliteVirtualFuncImplementation } from "./SqliteVirtualFuncImplementation";

export class SqliteVirtualFuncCall extends AbstractVirtualFuncCall {
    private internal: InternalSqliteDatabase;
    private id: number;

    private funcName: string;
    private funcAstName: string;
    private qualType: string;
    private range: Range;
    private baseFuncAstName: string;

    constructor(
        internal: InternalSqliteDatabase,
        id: number,
        args: VirtualFuncCreationArgs
    ) {
        super();

        this.internal = internal;
        this.id = id;

        this.funcName = args.funcName;
        this.funcAstName = args.funcAstName;
        this.qualType = args.qualType;
        this.range = args.range;
        this.baseFuncAstName = args.baseFuncAstName;
    }

    static createTableCalls(internalDb: InternalSqliteDatabase): void {
        internalDb.db.exec(`
            CREATE TABLE virtual_func_calls (
                id                   INTEGER PRIMARY KEY AUTOINCREMENT,
                func_name            TEXT NOT NULL,
                base_func_ast_name   TEXT NOT NULL,
                func_ast_name        TEXT NOT NULL,
                qual_type            TEXT NOT NULL,
                range_start_line     INTEGER,
                range_start_column   INTEGER,
                range_end_line       INTEGER,
                range_end_column     INTEGER,

                func_impl_id         INTEGER NULL,
                virtual_func_impl_id INTEGER NULL,

                FOREIGN KEY (func_impl_id) REFERENCES func_implementations(id),
                FOREIGN KEY (virtual_func_impl_id) REFERENCES virtual_func_implementations(id)
            )
        `);
    }

    static createVirtualFuncCall(
        internalDb: InternalSqliteDatabase,
        args: VirtualFuncCreationArgs,
        parent: {
            funcImplId?: number;
            virtualFuncImplId?: number;
        }
    ): SqliteVirtualFuncCall {
        const funcId = Number(
            internalDb.db
                .prepare(
                    `
                    INSERT INTO virtual_func_calls (
                        func_name,
                        func_ast_name,
                        qual_type,
                        range_start_line,
                        range_start_column,
                        range_end_line,
                        range_end_column,
                        base_func_ast_name,
                        func_impl_id,
                        virtual_func_impl_id
                    ) VALUES (
                        @funcName,
                        @funcAstName,
                        @qualType,
                        @rangeStartLine,
                        @rangeStartColumn,
                        @rangeEndLine,
                        @rangeEndColumn,
                        @baseFuncAstName,
                        @funcImplId,
                        @virtualFuncImplId
                    )
                `
                )
                .run({
                    funcName: args.funcName,
                    funcAstName: args.funcAstName,
                    qualType: args.qualType,
                    rangeStartLine: args.range.start.line,
                    rangeStartColumn: args.range.start.column,
                    rangeEndLine: args.range.end.line,
                    rangeEndColumn: args.range.end.column,
                    baseFuncAstName: args.baseFuncAstName,
                    funcImplId: parent.funcImplId,
                    virtualFuncImplId: parent.virtualFuncImplId,
                }).lastInsertRowid
        );

        return new SqliteVirtualFuncCall(internalDb, funcId, args);
    }

    static getVirtualFuncCalls(
        internalDb: InternalSqliteDatabase,
        parent: {
            funcImplId?: number;
            virtualFuncImplId?: number;
        }
    ): SqliteVirtualFuncCall[] {
        const rows = internalDb.db
            .prepare(
                `
            SELECT * FROM virtual_func_calls
            WHERE
                func_impl_id = @funcImplId OR
                virtual_func_impl_id = @virtualFuncImplId
        `
            )
            .all({
                funcImplId: parent.funcImplId,
                virtualFuncImplId: parent.virtualFuncImplId,
            });

        return rows.map((row: any) => {
            return new SqliteVirtualFuncCall(internalDb, row.id, {
                funcName: row.func_name,
                baseFuncAstName: row.base_func_ast_name,
                funcAstName: row.func_ast_name,
                qualType: row.qual_type,
                range: {
                    start: {
                        line: row.range_start_line,
                        column: row.range_start_column,
                    },
                    end: {
                        line: row.range_end_line,
                        column: row.range_end_column,
                    },
                },
            });
        });
    }

    static getMatchingCalls(
        internalDb: InternalSqliteDatabase,
        func: FuncBasics
    ): SqliteVirtualFuncCall[] {
        return internalDb.db
            .prepare(
                `
            SELECT *
            FROM virtual_func_calls
            WHERE func_name = @funcName AND base_func_ast_name = @baseFuncAstName AND qual_type = @qualType
            `
            )
            .all({
                funcName: func.getFuncName(),
                baseFuncAstName: (
                    func as VirtualFuncBasics
                ).getBaseFuncAstName(),
                qualType: func.getQualType(),
            })
            .map(
                (row) =>
                    new SqliteVirtualFuncCall(internalDb, (row as any).id, {
                        funcName: (row as any).func_name,
                        funcAstName: (row as any).func_ast_name,
                        baseFuncAstName: (row as any).base_func_ast_name,
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
    }

    private getImplIds(): [number | null, number | null] {
        const row = this.internal.db
            .prepare(
                "SELECT func_impl_id, virtual_func_impl_id FROM virtual_func_calls WHERE id=(?)"
            )
            .get(this.id);

        return [(row as any).func_impl_id, (row as any).virtual_func_impl_id];
    }

    getCaller(): FuncBasics | null {
        const [funcImplId, virtualFuncImplId] = this.getImplIds();

        if (funcImplId !== null) {
            return SqliteFuncImplementation.getFuncImplById(
                this.internal,
                funcImplId
            );
        }
        if (virtualFuncImplId !== null) {
            return SqliteVirtualFuncImplementation.getVirtualFuncImplById(
                this.internal,
                virtualFuncImplId
            );
        }

        // istanbul ignore next
        return null;
    }

    getFile(): File | null {
        const [funcImplId, virtualFuncImplId] = this.getImplIds();

        if (funcImplId !== null) {
            const impl = SqliteFuncImplementation.getFuncImplById(
                this.internal,
                funcImplId
            );

            if (impl !== null) {
                return impl.getFile();
            }
        }
        if (virtualFuncImplId !== null) {
            const impl = SqliteVirtualFuncImplementation.getVirtualFuncImplById(
                this.internal,
                virtualFuncImplId
            );

            if (impl !== null) {
                return impl.getFile();
            }
        }

        // istanbul ignore next
        return null;
    }

    removeAndChildren(): void {
        this.internal.db
            .prepare(
                `
            DELETE FROM virtual_func_calls
            WHERE id = @id
        `
            )
            .run({ id: this.id });
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

    getBaseFuncAstName(): string {
        return this.baseFuncAstName;
    }
}
