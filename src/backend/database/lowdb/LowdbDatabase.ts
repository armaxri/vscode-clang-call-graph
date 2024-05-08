import { LowSync } from "@identityinvest/lowdb";
import { JSONFileSync } from "@identityinvest/lowdb/node";
// import { JSONFileSyncPreset } from "lowdb/lib/presets/node";
import { Config } from "../../Config";
import * as db from "../Database";
import {
    LowdbInternalDatabase,
    createEmptyLowdbInternalDatabase,
} from "./lowdb_internal_structure";
import { LowdbCppFile } from "./impls/LowdbCppFile";
import { LowdbHppFile } from "./impls/LowdbHppFile";
import { AbstractDatabase } from "../helper/AbstractDatabase";

export class LowdbDatabase extends AbstractDatabase {
    private adapter!: JSONFileSync<LowdbInternalDatabase>;
    private database!: LowSync<LowdbInternalDatabase>;

    constructor(config: Config) {
        super(config);

        this.initDatabase();
    }

    async getCppFiles(): Promise<db.CppFile[]> {
        return this.database.data.cppFiles.map((cppFile) => {
            return new LowdbCppFile(cppFile);
        });
    }

    async hasCppFile(name: string): Promise<boolean> {
        return (
            this.database.data.cppFiles.find(
                (cppFile) => cppFile.name === name
            ) !== undefined
        );
    }

    async getOrAddCppFile(name: string): Promise<db.CppFile> {
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

    async removeCppFileAndDependingContent(name: string): Promise<void> {
        this.database.data.cppFiles = this.database.data.cppFiles.filter(
            (cppFile) => cppFile.name !== name
        );
    }

    async getHppFiles(): Promise<db.HppFile[]> {
        return this.database.data.hppFiles.map((hppFile) => {
            return new LowdbHppFile(hppFile);
        });
    }

    async hasHppFile(name: string): Promise<boolean> {
        return (
            this.database.data.hppFiles.find(
                (hppFile) => hppFile.name === name
            ) !== undefined
        );
    }

    async getOrAddHppFile(name: string): Promise<db.HppFile> {
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

    async removeHppFileAndDependingContent(name: string): Promise<void> {
        this.database.data.hppFiles = this.database.data.hppFiles.filter(
            (hppFile) => hppFile.name !== name
        );
    }

    async writeDatabase(): Promise<void> {
        this.database.write();
    }

    async resetDatabase(): Promise<void> {
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

    async equals(otherInput: any): Promise<boolean> {
        return await super.equals(otherInput);
    }
}
