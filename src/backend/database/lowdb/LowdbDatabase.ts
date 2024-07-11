import { LowSync } from "@identityinvest/lowdb";
import { JSONFileSync } from "@identityinvest/lowdb/node";
import { Config } from "../../Config";
import * as db from "../Database";
import {
    LowdbInternalDatabase,
    createEmptyLowdbInternalDatabase,
} from "./lowdb_internal_structure";
import { LowdbCppFile } from "./impls/LowdbCppFile";
import { LowdbHppFile } from "./impls/LowdbHppFile";
import { AbstractDatabase } from "../impls/AbstractDatabase";
import { FuncBasics, VirtualFuncBasics } from "../cpp_structure";

export class LowdbDatabase extends AbstractDatabase {
    private adapter!: JSONFileSync<LowdbInternalDatabase>;
    private database!: LowSync<LowdbInternalDatabase>;

    constructor(config: Config) {
        super(config);

        this.initDatabase();
    }

    getCppFiles(): db.CppFile[] {
        return this.database.data.cppFiles.map((cppFile) => {
            return new LowdbCppFile(this.database, cppFile);
        });
    }

    getCppFile(name: string): db.CppFile | null {
        var file = this.database.data.cppFiles.find(
            (cppFile) => cppFile.name === name
        );

        if (!file) {
            return null;
        }

        return new LowdbCppFile(this.database, file);
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

        return new LowdbCppFile(this.database, file);
    }

    removeCppFileAndDependingContent(name: string): void {
        this.database.data.cppFiles = this.database.data.cppFiles.filter(
            (cppFile) => cppFile.name !== name
        );
    }

    getHppFiles(): db.HppFile[] {
        return this.database.data.hppFiles.map((hppFile) => {
            return new LowdbHppFile(this.database, hppFile);
        });
    }

    getHppFile(name: string): db.HppFile | null {
        var file = this.database.data.hppFiles.find(
            (hppFile) => hppFile.name === name
        );

        if (!file) {
            return null;
        }

        return new LowdbHppFile(this.database, file);
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

        return new LowdbHppFile(this.database, file);
    }

    removeHppFileAndDependingContent(name: string): void {
        this.database.data.hppFiles = this.database.data.hppFiles.filter(
            (hppFile) => hppFile.name !== name
        );
    }

    getMatchingFuncImpls(func: FuncBasics): FuncBasics[] {
        const matchingFuncs: FuncBasics[] = [];

        this.getCppFiles().forEach((cppFile) => {
            matchingFuncs.push(
                ...(cppFile as LowdbCppFile).getMatchingFuncImpls(func)
            );
        });

        this.getHppFiles().forEach((hppFile) => {
            matchingFuncs.push(
                ...(hppFile as LowdbHppFile).getMatchingFuncImpls(func)
            );
        });

        return matchingFuncs;
    }

    getMatchingVirtualFuncImpls(func: VirtualFuncBasics): VirtualFuncBasics[] {
        const matchingFuncs: VirtualFuncBasics[] = [];

        this.getCppFiles().forEach((cppFile) => {
            matchingFuncs.push(
                ...(cppFile as LowdbCppFile).getMatchingVirtualFuncImpls(func)
            );
        });

        this.getHppFiles().forEach((hppFile) => {
            matchingFuncs.push(
                ...(hppFile as LowdbHppFile).getMatchingVirtualFuncImpls(func)
            );
        });

        return matchingFuncs;
    }

    writeDatabase(): void {
        this.database.write();
    }

    resetDatabase(): void {
        console.log("Resetting database.");

        this.database.data = createEmptyLowdbInternalDatabase();
        this.database.write();
        console.log("Data cleared.");

        this.initDatabase();
    }

    private initDatabase() {
        console.log("Initializing database.");
        const databasePath = this.config.getLowdbDatabasePath().pathString();
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

    equals(otherInput: any): boolean {
        return super.equals(otherInput);
    }
}
