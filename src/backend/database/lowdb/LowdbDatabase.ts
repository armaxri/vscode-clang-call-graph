import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";
// import { JSONFileSyncPreset } from "lowdb/lib/presets/node";
import { Config } from "../../Config";
import * as db from "../Database";
import {
    LowdbInternalDatabase,
    createEmptyLowdbInternalDatabase,
} from "./lowdb_internal_structure";
import { LowdbCppFile } from "./impls/LowdbCppFile";
import { LowdbHppFile } from "./impls/LowdbHppFile";

export class LowdbDatabase implements db.Database {
    private config: Config;
    private adapter!: JSONFileSync<LowdbInternalDatabase>;
    private database!: LowSync<LowdbInternalDatabase>;

    constructor(config: Config) {
        this.config = config;

        this.initDatabase();
    }

    hasCppFile(name: string): boolean {
        return (
            this.database.data.cppFiles.find(
                (cppFile) => cppFile.name === name
            ) !== undefined
        );
    }

    getOrAddCppFile(name: string): db.CppFile {
        var file = this.database.data.cppFiles.find(
            (cppFile) => cppFile.name === name
        );

        if (!file) {
            file = {
                name: name,
                lastAnalyzed: Date.now(),
                classes: [],
                funcDecls: [],
                funcImpls: [],
                virtualFuncImpls: [],
            };
            this.database.data.cppFiles.push(file);
        }

        return new LowdbCppFile(file);
    }

    removeCppFileAndDependingContent(name: string): void {
        this.database.data.cppFiles = this.database.data.cppFiles.filter(
            (cppFile) => cppFile.name !== name
        );
    }

    hasHppFile(name: string): boolean {
        return (
            this.database.data.hppFiles.find(
                (hppFile) => hppFile.name === name
            ) !== undefined
        );
    }

    getOrAddHppFile(name: string): db.HppFile {
        var file = this.database.data.hppFiles.find(
            (hppFile) => hppFile.name === name
        );

        if (!file) {
            file = {
                name: name,
                lastAnalyzed: Date.now(),
                classes: [],
                funcDecls: [],
                funcImpls: [],
                virtualFuncImpls: [],
                referencedFromCppFiles: [],
            };
            this.database.data.hppFiles.push(file);
        }

        return new LowdbHppFile(file);
    }

    removeHppFileAndDependingContent(name: string): void {
        this.database.data.hppFiles = this.database.data.hppFiles.filter(
            (hppFile) => hppFile.name !== name
        );
    }

    writeDatabase(): void {
        this.database.write();
    }

    resetDatabase() {
        console.log("Resetting database.");

        this.database.data = createEmptyLowdbInternalDatabase();
        this.database.write();
        console.log("Data cleared.");

        this.initDatabase();
    }

    private initDatabase() {
        console.log("Initializing database.");
        const databasePath = this.config.getLowdbDatabasePath();
        this.adapter = new JSONFileSync<LowdbInternalDatabase>(databasePath);
        this.database = new LowSync<LowdbInternalDatabase>(
            this.adapter,
            createEmptyLowdbInternalDatabase()
        );

        // Read the database from the filesystem if present and write it back to ensure the file is created.
        this.database.read();
        this.database.write();

        console.log(
            `Database initialized with "${databasePath}" as storage location.`
        );
    }
}
