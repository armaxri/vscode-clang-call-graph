//import * as lowdb from "lowdb";
//import * as lowdbNode from "lowdb/lib/node";
import { Configuration } from "./Configuration";
import * as iDb from "../backend/IDatabase";

const CURRENT_DATABASE_VERSION = 1;

type FileReadTime = {
    fileName: string;
    /**
     * Time of the last modification of the file.
     */
    modTime: Date;
};

type HeaderParsedInCpp = {
    hppFileName: string;
    cppFileName: string;
};

type DatabaseStructure = {
    databaseVersion: number;

    compileCommandsJson: FileReadTime;
    readFiles: Array<FileReadTime>;
    hppCppLink: Array<HeaderParsedInCpp>;

    funcDecls: Array<iDb.FuncMentioning>;
    funcCalls: Array<iDb.FuncCall>;
};

export class Database {
    // databaseFileAdapter: lowdbNode.JSONFile<DatabaseStructure>;
    // database: lowdb.Low<DatabaseStructure>;

    constructor(config: Configuration) {
        // this.databaseFileAdapter = new lowdbNode.JSONFile<DatabaseStructure>(
        //     config.callGraphDatabasePath
        // );
        // this.database = new lowdb.Low(this.databaseFileAdapter);

        this.initDatabase(config);
    }

    public resetDatabase(config: Configuration) {
        //        this.database.write();
        //
        //        this.databaseFileAdapter = new lowdbNode.JSONFile<DatabaseStructure>(
        //            config.callGraphDatabasePath
        //        );
        //        this.database = new lowdb.Low(this.databaseFileAdapter);
    }

    private initDatabase(config: Configuration) {
        //        this.database.read();
        //
        //        // Make sure that even an empty database has content.
        //        if (this.database.data === null) {
        //            this.database.data = this.createDefaultContent();
        //        }
        //
        //        // Ensure that the version is matching and if not erase database content.
        //        if (this.database.data.databaseVersion !== CURRENT_DATABASE_VERSION) {
        //            this.database.data = this.createDefaultContent();
        //        }
        //
        //        this.database.write();
    }

    private createDefaultContent(): DatabaseStructure {
        return {
            databaseVersion: CURRENT_DATABASE_VERSION,
            compileCommandsJson: { fileName: "", modTime: new Date(0) },
            readFiles: new Array<FileReadTime>(),
            hppCppLink: new Array<HeaderParsedInCpp>(),
            funcCalls: new Array<iDb.FuncCall>(),
            funcDecls: new Array<iDb.FuncMentioning>(),
        };
    }
}
