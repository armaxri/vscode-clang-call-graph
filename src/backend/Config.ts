import { PathUtils } from "./utils/PathUtils";

export enum DatabaseType {
    sqlite,
    lowdb,
}

export abstract class Config {
    abstract getCompileCommandsJsonDir(): string;

    getCompileCommandsJsonName(): string {
        return "compile_commands.json";
    }

    getCompileCommandsJsonPath(): string {
        return new PathUtils(
            this.getCompileCommandsJsonDir(),
            this.getCompileCommandsJsonName()
        ).pathString();
    }

    getNumOfParserThreads(): number {
        return 8;
    }

    getSelectedDatabaseType(): DatabaseType {
        // TODO: Change the default to sqlite before releasing the extension.
        return DatabaseType.lowdb;
    }

    abstract getCallGraphDatabaseDir(): string;

    getSqliteDatabaseName(): string {
        return "clang_call_graph.sqlite3";
    }

    getSqliteDatabasePath(): string {
        return new PathUtils(
            this.getCallGraphDatabaseDir(),
            this.getSqliteDatabaseName()
        ).pathString();
    }

    getLowdbDatabaseName(): string {
        return "clang_call_graph.json";
    }

    getLowdbDatabasePath(): string {
        return new PathUtils(
            this.getCallGraphDatabaseDir(),
            this.getLowdbDatabaseName()
        ).pathString();
    }

    useDatabaseCaching(): boolean {
        return true;
    }

    // For development purposes.
    runVerbose(): boolean {
        // TODO: Change this to false before releasing the extension.
        return true;
    }
}
