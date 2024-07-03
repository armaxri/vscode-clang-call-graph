import {
    Range,
    FuncCall,
    FuncCallCreationArgs,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
    VirtualFuncCreationArgs,
    File,
} from "../../cpp_structure";
import {
    funcCallArgs2FuncArgs,
    virtualFuncCallArgs2VirtualFuncArgs,
} from "../../helper/func_creation_args_converter";
import { AbstractVirtualFuncImplementation } from "../../impls/AbstractVirtualFuncImplementation";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";
import { SqliteCppClass } from "./SqliteCppClass";
import { SqliteCppFile } from "./SqliteCppFile";
import { SqliteFuncCall } from "./SqliteFuncCall";
import { SqliteHppFile } from "./SqliteHppFile";
import { SqliteVirtualFuncCall } from "./SqliteVirtualFuncCall";

export class SqliteVirtualFuncImplementation extends AbstractVirtualFuncImplementation {
    private internal: InternalSqliteDatabase;
    private id: number;

    private funcName: string;
    private baseFuncAstName: string;
    private funcAstName: string;
    private qualType: string;
    private range: Range;
    private funcCalls: FuncCall[];
    private virtualFuncCalls: VirtualFuncCall[];

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

        this.funcCalls = SqliteFuncCall.getFuncCalls(this.internal, {
            virtualFuncImplId: this.id,
        });
        this.virtualFuncCalls = SqliteVirtualFuncCall.getVirtualFuncCalls(
            this.internal,
            {
                virtualFuncImplId: this.id,
            }
        );
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

    static getVirtualFuncImplById(
        internalDb: InternalSqliteDatabase,
        id: number
    ): SqliteVirtualFuncImplementation | null {
        const row = internalDb.db
            .prepare(
                `
            SELECT * FROM virtual_func_implementations
            WHERE id = @id
        `
            )
            .get({ id });

        // istanbul ignore next
        if (row === undefined) {
            return null;
        }

        return new SqliteVirtualFuncImplementation(internalDb, id, {
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
        });
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

    private getCppHppFileAndCppClassIds(): [
        number | null,
        number | null,
        number | null
    ] {
        const row = this.internal.db
            .prepare(
                "SELECT cpp_file_id, hpp_file_id, cpp_class_id FROM virtual_func_implementations WHERE id=(?)"
            )
            .get(this.id);

        return [
            (row as any).cpp_file_id,
            (row as any).hpp_file_id,
            (row as any).cpp_class_id,
        ];
    }

    getFile(): File | null {
        const [cppFileId, hppFileId, cppClassId] =
            this.getCppHppFileAndCppClassIds();

        if (cppFileId !== null) {
            return SqliteCppFile.getCppFileById(this.internal, cppFileId);
        }

        if (hppFileId !== null) {
            return SqliteHppFile.getHppFileById(this.internal, hppFileId);
        }

        if (cppClassId !== null) {
            const cppClass = SqliteCppClass.getCppClassById(
                this.internal,
                cppClassId
            );

            if (cppClass !== null) {
                return cppClass.getFile();
            }
        }

        // istanbul ignore next
        return null;
    }

    removeAndChildren(): void {
        this.funcCalls.forEach((funcCall) => {
            (funcCall as SqliteFuncCall).removeAndChildren();
        });

        this.virtualFuncCalls.forEach((virtualFuncCall) => {
            (virtualFuncCall as SqliteVirtualFuncCall).removeAndChildren();
        });

        this.internal.db
            .prepare(
                `
            DELETE FROM virtual_func_implementations
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

    getFuncCalls(): FuncCall[] {
        return this.funcCalls;
    }

    addFuncCall(funcCall: FuncCallCreationArgs): FuncCall {
        const newCall = SqliteFuncCall.createFuncCall(
            this.internal,
            funcCallArgs2FuncArgs(funcCall),
            {
                virtualFuncImplId: this.id,
            }
        );
        this.funcCalls.push(newCall);
        return newCall;
    }

    getVirtualFuncCalls(): VirtualFuncCall[] {
        return this.virtualFuncCalls;
    }

    addVirtualFuncCall(
        virtualFuncCall: VirtualFuncCallCreationArgs
    ): VirtualFuncCall {
        const newCall = SqliteVirtualFuncCall.createVirtualFuncCall(
            this.internal,
            virtualFuncCallArgs2VirtualFuncArgs(virtualFuncCall),
            {
                virtualFuncImplId: this.id,
            }
        );
        this.virtualFuncCalls.push(newCall);
        return newCall;
    }
}
