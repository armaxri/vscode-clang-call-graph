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
    protected databaseType: DatabaseType = DatabaseType.lowdb;
    protected sqliteDatabaseName = "clang_call_graph.sqlite3";
    protected lowdbDatabaseName = "clang_call_graph.json";
    protected verbose: boolean = false;

    constructor() {}

    abstract getCompileCommandsJsonDir(): string;

    getCompileCommandsJsonName(): string {
        return this.compileCommandsJsonName;
    }

    getCompileCommandsJsonPath(): PathUtils {
        return new PathUtils(
            this.getCompileCommandsJsonDir(),
            this.getCompileCommandsJsonName()
        );
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

    getSqliteDatabasePath(): PathUtils {
        return new PathUtils(
            this.getCallGraphDatabaseDir(),
            this.getSqliteDatabaseName()
        );
    }

    getLowdbDatabaseName(): string {
        return this.lowdbDatabaseName;
    }

    getLowdbDatabasePath(): PathUtils {
        return new PathUtils(
            this.getCallGraphDatabaseDir(),
            this.getLowdbDatabaseName()
        );
    }

    getSelectedDatabasePath(): PathUtils {
        switch (this.getSelectedDatabaseType()) {
            case DatabaseType.sqlite:
                return this.getSqliteDatabasePath();
            case DatabaseType.lowdb:
                return this.getLowdbDatabasePath();
            // istanbul ignore next
            default:
                throw new Error("Unknown database type");
        }
    }

    // For development purposes.
    runVerbose(): boolean {
        return this.verbose;
    }
}
