import * as fs from "fs";
import * as child_process from "child_process";
import * as clang_ast from "./clang_ast_json";
import { Configuration } from "../extension/Configuration";
import { Database } from "../extension/Database";
import { PathUtils } from "./utils/PathUtils";
import * as utils from "./utils/utils";

interface ICompileCommand {
    directory: string;
    command: string;
    file: string;
}

enum CallGraphParsingState {
    readCompileCommandsJson,
    readCppFiles,
    updateCppAndHppFiles,
}

export class ClangCallGraphParser {
    running: boolean = false;
    config: Configuration;
    database: Database;
    compileCommands: Array<ICompileCommand> = new Array<ICompileCommand>();
    callGraphParsingState: CallGraphParsingState =
        CallGraphParsingState.readCompileCommandsJson;

    constructor(config: Configuration, database: Database) {
        this.config = config;
        this.database = database;
    }

    public startParser(newConfig: Configuration) {
        this.config = newConfig;
        this.callGraphParsingState =
            CallGraphParsingState.readCompileCommandsJson;
        this.running = true;

        this.updateCallGraph();
    }

    public stopParser() {
        this.running = false;
    }

    async updateCallGraph() {
        while (this.running) {
            switch (this.callGraphParsingState) {
                case CallGraphParsingState.readCompileCommandsJson: {
                    if (this.updateCompileCommands()) {
                        this.callGraphParsingState =
                            CallGraphParsingState.readCppFiles;
                    } else {
                        await utils.delay(5000);
                    }
                    break;
                }
                case CallGraphParsingState.readCppFiles: {
                    this.compileCommands.forEach((compileCommand) => {
                        this.parseCppFile(compileCommand);
                    });
                    break;
                }
                case CallGraphParsingState.updateCppAndHppFiles: {
                    break;
                }
            }
        }
    }

    updateCompileCommands(): boolean {
        const compileCommandsJsonDir = new PathUtils(
            this.config.compileCommandsJsonPath
        );
        if (!compileCommandsJsonDir.doesExist()) {
            console.log(
                `The directory '${compileCommandsJsonDir.pathString()}', which should contain the 'compile_commands.json' file, does't exist.`
            );
            this.compileCommands = new Array<ICompileCommand>();
            return false;
        }

        const compileCommandsJsonFile = compileCommandsJsonDir.joinPath(
            "compile_commands.json"
        );
        if (!compileCommandsJsonFile.doesExist()) {
            console.log(
                `The file 'compile_commands.json' cannot be found in the directory '${compileCommandsJsonFile.pathString()}'.`
            );
            this.compileCommands = new Array<ICompileCommand>();
            return false;
        }

        var rawFileData = fs
            .readFileSync(compileCommandsJsonFile.pathString())
            .toString();
        var jsonCompileCommands = JSON.parse(rawFileData);
        this.compileCommands = jsonCompileCommands as Array<ICompileCommand>;

        return true;
    }

    async parseCppFile(command: ICompileCommand) {
        const clangAstCommand = utils.createClangAstCall(command.command);
        var clangCall = clangAstCommand.join(" ");

        child_process.exec(clangCall, (error, stdout, stderr) => {
            var jsonClangAst = JSON.parse(stdout);
        });
    }
}
