import { PathUtils } from "./utils/PathUtils";

export enum DatabaseType {
    sqlite,
    lowdb,
}

export function convertStrToDatabaseType(str: string): DatabaseType {
    switch (str) {
        case "sqlite":
            return DatabaseType.sqlite;
        case "lowdb":
            return DatabaseType.lowdb;
        default:
            throw new Error("Unknown database type");
    }
}

export abstract class Config {
    protected compileCommandsJsonName: string = "compile_commands.json";
    protected numOfParserThreads: number = 8;
    protected databaseType: DatabaseType;
    protected sqliteDatabaseName = "clang_call_graph.sqlite3";
    protected lowdbDatabaseName = "clang_call_graph.json";
    protected enableDatabaseCaching = true;
    protected verbose;

    constructor(
        databasetype: DatabaseType = DatabaseType.lowdb,
        verbose = false
    ) {
        this.databaseType = databasetype;
        this.verbose = verbose;
    }

    abstract getCompileCommandsJsonDir(): string;

    getCompileCommandsJsonName(): string {
        return this.compileCommandsJsonName;
    }

    getCompileCommandsJsonPath(): string {
        return new PathUtils(
            this.getCompileCommandsJsonDir(),
            this.getCompileCommandsJsonName()
        ).pathString();
    }

    getNumOfParserThreads(): number {
        return this.numOfParserThreads;
    }

    getSelectedDatabaseType(): DatabaseType {
        return this.databaseType;
    }

    abstract getCallGraphDatabaseDir(): string;

    getSqliteDatabaseName(): string {
        return this.sqliteDatabaseName;
    }

    getSqliteDatabasePath(): string {
        return new PathUtils(
            this.getCallGraphDatabaseDir(),
            this.getSqliteDatabaseName()
        ).pathString();
    }

    getLowdbDatabaseName(): string {
        return this.lowdbDatabaseName;
    }

    getLowdbDatabasePath(): string {
        return new PathUtils(
            this.getCallGraphDatabaseDir(),
            this.getLowdbDatabaseName()
        ).pathString();
    }

    getSelectedDatabasePath(): string {
        switch (this.getSelectedDatabaseType()) {
            case DatabaseType.sqlite:
                return this.getSqliteDatabasePath();
            case DatabaseType.lowdb:
                return this.getLowdbDatabasePath();
            default:
                throw new Error("Unknown database type");
        }
    }

    useDatabaseCaching(): boolean {
        return this.enableDatabaseCaching;
    }

    // For development purposes.
    runVerbose(): boolean {
        return this.verbose;
    }
}
