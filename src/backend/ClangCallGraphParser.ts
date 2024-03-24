import * as fs from "fs";
import * as child_process from "child_process";
import { IParserConfig } from "./IParserConfig";
import { IDatabase } from "./IDatabase";
import { PathUtils } from "./utils/PathUtils";
import * as utils from "./utils/utils";
import { IAstWalkerFactory } from "./IAstWalkerFactory";

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
    private shouldRun: boolean = false;
    private running: boolean = false;
    private config: IParserConfig;
    private database: IDatabase;
    private compileCommands: Array<ICompileCommand> =
        new Array<ICompileCommand>();
    private callGraphParsingState: CallGraphParsingState =
        CallGraphParsingState.readCompileCommandsJson;
    private walkerFactory: IAstWalkerFactory;

    constructor(
        config: IParserConfig,
        database: IDatabase,
        walkerFactory: IAstWalkerFactory
    ) {
        this.config = config;
        this.database = database;
        this.walkerFactory = walkerFactory;
    }

    public startParser(newConfig: IParserConfig) {
        this.config = newConfig;
        this.callGraphParsingState =
            CallGraphParsingState.readCompileCommandsJson;
        this.shouldRun = true;
        this.running = true;

        this.updateCallGraph();
    }

    public isRunning(): boolean {
        return this.running;
    }

    public stopParser() {
        this.shouldRun = false;
    }

    private async updateCallGraph() {
        while (!this.shouldRun) {
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
        this.running = false;
    }

    private updateCompileCommands(): boolean {
        const compileCommandsJsonDir = new PathUtils(
            this.config.getCompileCommandsJsonPath()
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

    private async parseCppFile(command: ICompileCommand) {
        const clangAstCommand = utils.createClangAstCall(command.command);
        var clangCall = clangAstCommand.join(" ");

        child_process.exec(clangCall, (error, stdout, stderr) => {
            var jsonClangAst = JSON.parse(stdout);
        });
    }
}
