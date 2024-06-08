import {
    Range,
    FuncCall,
    FuncCallCreationArgs,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    VirtualFuncCreationArgs,
} from "../../cpp_structure";
import {
    funcCallArgs2FuncArgs,
    virtualFuncCallArgs2VirtualFuncArgs,
} from "../../helper/func_creation_args_converter";
import { AbstractVirtualFuncImplementation } from "../../impls/AbstractVirtualFuncImplementation";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";
import { SqliteFuncCall } from "./SqliteFuncCall";
import { SqliteVirtualFuncCall } from "./SqliteVirtualFuncCall";

export class SqliteVirtualFuncImplementation extends AbstractVirtualFuncImplementation {
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
            CREATE TABLE virtual_func_implementations (
                id                 INTEGER PRIMARY KEY AUTOINCREMENT,
                base_func_ast_name TEXT NOT NULL,
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

    static createVirtualFuncImpl(
        internalDb: InternalSqliteDatabase,
        args: VirtualFuncCreationArgs,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
            cppClassId?: number;
        }
    ): SqliteVirtualFuncImplementation {
        const funcId = Number(
            internalDb.db
                .prepare(
                    `
            INSERT INTO virtual_func_implementations (base_func_ast_name,
                func_name, func_ast_name, qual_type, range_start_line, range_start_column,
                range_end_line, range_end_column, cpp_file_id, hpp_file_id, cpp_class_id)
            VALUES(@baseFuncAstName, @funcName, @funcAstName, @qualType, @rangeStartLine, @rangeStartColumn, @rangeEndLine,
                @rangeEndColumn, @cppFileId, @hppFileId, @cppClassId)
            `
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
                    cppFileId: parent.cppFileId,
                    hppFileId: parent.hppFileId,
                    cppClassId: parent.cppClassId,
                }).lastInsertRowid
        );

        return new SqliteVirtualFuncImplementation(internalDb, funcId, args);
    }

    static getVirtualFuncImpl(
        internalDb: InternalSqliteDatabase,
        virtualFuncCall: VirtualFuncCreationArgs,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
            cppClassId?: number;
        }
    ): SqliteVirtualFuncImplementation | null {
        const row = internalDb.db
            .prepare(
                `
            SELECT * FROM virtual_func_implementations
            WHERE func_name = @funcName AND base_func_ast_name = @baseFuncAstName AND qual_type = @qualType AND func_ast_name = @funcAstName
                AND (cpp_file_id = @cppFileId OR hpp_file_id = @hppFileId OR cpp_class_id = @cppClassId)
            `
            )
            .get({
                funcName: virtualFuncCall.funcName,
                baseFuncAstName: virtualFuncCall.baseFuncAstName,
                qualType: virtualFuncCall.qualType,
                funcAstName: virtualFuncCall.funcAstName,
                cppFileId: parent.cppFileId,
                hppFileId: parent.hppFileId,
                cppClassId: parent.cppClassId,
            });

        if (!row) {
            return null;
        }

        return new SqliteVirtualFuncImplementation(
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
        );
    }

    static getVirtualFuncImpls(
        internalDb: InternalSqliteDatabase,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
            cppClassId?: number;
        }
    ): SqliteVirtualFuncImplementation[] {
        const virtualFuncImpls: SqliteVirtualFuncImplementation[] = [];

        const rows = internalDb.db
            .prepare(
                `
            SELECT * FROM virtual_func_implementations
            WHERE cpp_file_id = @cppFileId OR hpp_file_id = @hppFileId OR cpp_class_id = @cppClassId
            `
            )
            .all({
                cppFileId: parent.cppFileId,
                hppFileId: parent.hppFileId,
                cppClassId: parent.cppClassId,
            });

        for (const row of rows) {
            virtualFuncImpls.push(
                new SqliteVirtualFuncImplementation(
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
        }

        return virtualFuncImpls;
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

    getFuncCalls(): FuncCall[] {
        return SqliteFuncCall.getFuncCalls(this.internal, {
            virtualFuncImplId: this.id,
        });
    }

    addFuncCall(funcCall: FuncCallCreationArgs): void {
        SqliteFuncCall.createFuncCall(
            this.internal,
            funcCallArgs2FuncArgs(funcCall),
            {
                virtualFuncImplId: this.id,
            }
        );

        return;
    }

    getVirtualFuncCalls(): VirtualFuncCall[] {
        return SqliteVirtualFuncCall.getVirtualFuncCalls(this.internal, {
            virtualFuncImplId: this.id,
        });
    }

    addVirtualFuncCall(virtualFuncCall: VirtualFuncCallCreationArgs): void {
        SqliteVirtualFuncCall.createVirtualFuncCall(
            this.internal,
            virtualFuncCallArgs2VirtualFuncArgs(virtualFuncCall),
            {
                virtualFuncImplId: this.id,
            }
        );

        return;
    }
}
