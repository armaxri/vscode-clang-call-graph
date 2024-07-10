import {
    File,
    FuncBasics,
    FuncCall,
    FuncCallCreationArgs,
    FuncCreationArgs,
    Range,
    VirtualFuncCall,
    VirtualFuncCallCreationArgs,
} from "../../cpp_structure";
import {
    funcCallArgs2FuncArgs,
    virtualFuncCallArgs2VirtualFuncArgs,
} from "../../helper/func_creation_args_converter";
import { AbstractFuncImplementation } from "../../impls/AbstractFuncImplementation";
import { InternalSqliteDatabase } from "../InternalSqliteDatabase";
import { SqliteCppClass } from "./SqliteCppClass";
import { SqliteCppFile } from "./SqliteCppFile";
import { SqliteFuncCall } from "./SqliteFuncCall";
import { SqliteHppFile } from "./SqliteHppFile";
import { SqliteVirtualFuncCall } from "./SqliteVirtualFuncCall";

export class SqliteFuncImplementation extends AbstractFuncImplementation {
    private internal: InternalSqliteDatabase;
    private id: number;

    private funcName: string;
    private funcAstName: string;
    private qualType: string;
    private range: Range;
    private funcCalls: FuncCall[];
    private virtualFuncCalls: VirtualFuncCall[];

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

        this.funcCalls = SqliteFuncCall.getFuncCalls(this.internal, {
            funcImplId: this.id,
        });
        this.virtualFuncCalls = SqliteVirtualFuncCall.getVirtualFuncCalls(
            this.internal,
            {
                funcImplId: this.id,
            }
        );
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
                cpp_class_id       INTEGER NULL,

                FOREIGN KEY (cpp_file_id) REFERENCES cpp_files(id),
                FOREIGN KEY (hpp_file_id) REFERENCES hpp_files(id),
                FOREIGN KEY (cpp_class_id) REFERENCES cpp_classes(id)
            )
        `);
    }

    static getFuncImplById(
        internalDb: InternalSqliteDatabase,
        id: number
    ): SqliteFuncImplementation | null {
        const row = internalDb.db
            .prepare("SELECT * FROM func_implementations WHERE id=(?)")
            .get(id);

        // istanbul ignore next
        if (row === undefined) {
            return null;
        }

        return new SqliteFuncImplementation(internalDb, id, {
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

    static createFuncImpl(
        internalDb: InternalSqliteDatabase,
        args: FuncCreationArgs,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
            cppClassId?: number;
        }
    ): SqliteFuncImplementation {
        const funcId = Number(
            internalDb.db
                .prepare(
                    `
                    INSERT INTO func_implementations (func_name, func_ast_name, qual_type, range_start_line, range_start_column,
                        range_end_line, range_end_column, cpp_file_id, hpp_file_id, cpp_class_id)
                    VALUES (@funcName, @funcAstName, @qualType, @rangeStartLine, @rangeStartColumn, @rangeEndLine, @rangeEndColumn,
                        @cppFileId, @hppFileId, @cppClassId)`
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

        return new SqliteFuncImplementation(internalDb, funcId, args);
    }

    static getFuncImpls(
        internalDb: InternalSqliteDatabase,
        parent: {
            cppFileId?: number;
            hppFileId?: number;
            cppClassId?: number;
        }
    ): SqliteFuncImplementation[] {
        const funcImpls: SqliteFuncImplementation[] = [];

        internalDb.db
            .prepare(
                "SELECT * FROM func_implementations WHERE cpp_file_id=(?) OR hpp_file_id=(?) OR cpp_class_id=(?)"
            )
            .all(parent.cppFileId, parent.hppFileId, parent.cppClassId)
            .forEach((row) => {
                const funcImpl = new SqliteFuncImplementation(
                    internalDb,
                    (row as any).id,
                    {
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

                // TODO: Add function calls to implementation.

                funcImpls.push(funcImpl);
            });

        return funcImpls;
    }

    static getMatchingFuncImpls(
        internalDb: InternalSqliteDatabase,
        func: FuncBasics
    ): SqliteFuncImplementation[] {
        const funcImpls: SqliteFuncImplementation[] = [];

        internalDb.db
            .prepare(
                "SELECT * FROM func_implementations WHERE func_name=(?) AND func_ast_name=(?) AND qual_type=(?)"
            )
            .all(func.getFuncName(), func.getFuncAstName(), func.getQualType())
            .forEach((row) => {
                const funcImpl = new SqliteFuncImplementation(
                    internalDb,
                    (row as any).id,
                    {
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

                funcImpls.push(funcImpl);
            });

        return funcImpls;
    }

    private getCppHppFileAndCppClassIds(): [
        number | null,
        number | null,
        number | null
    ] {
        const row = this.internal.db
            .prepare(
                "SELECT cpp_file_id, hpp_file_id, cpp_class_id FROM func_implementations WHERE id=(?)"
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
            .prepare("DELETE FROM func_implementations WHERE id=(?)")
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

    getFuncCalls(): FuncCall[] {
        return this.funcCalls;
    }

    addFuncCall(funcCall: FuncCallCreationArgs): FuncCall {
        const newCall = SqliteFuncCall.createFuncCall(
            this.internal,
            funcCallArgs2FuncArgs(funcCall),
            {
                funcImplId: this.id,
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
                funcImplId: this.id,
            }
        );
        this.virtualFuncCalls.push(newCall);
        return newCall;
    }
}
