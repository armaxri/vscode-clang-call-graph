import { AstWalkerFactory } from "./astWalker/AstWalkerFactory";
import { Database } from "./database/Database";
import { Config } from "./Config";
import { delay } from "./utils/utils";
import { UserInterface } from "./UserInterface";

export interface ICompileCommand {
    directory: string;
    command: string;
    file: string;
}

export type AnalyzedFile = {
    file: string;
    command: string;
    lastAnalyzed: number;
};

export enum FilesystemWatcherState {
    initial,
    running,
    stopping,
    stopped,
}

export class ClangFilesystemWatcher {
    private state: FilesystemWatcherState = FilesystemWatcherState.initial;
    private config: Config;
    private userInterface: UserInterface;
    private database: Database;
    private walkerFactory: AstWalkerFactory;
    private fileParsingErrorCnt: number = 0;

    // The C and C++ files are analyzed in parallel by a group of workers.
    // This array stores the promises of the workers, so that the main thread can await them on shutdown.
    // The file changes are observed by the starting thread of the startWatching method.
    private workerAwaits: Promise<void>[] = [];
    private workerTasks: ICompileCommand[] = [];

    private analyzedFiles: AnalyzedFile[] = [];

    constructor(
        config: Config,
        userInterface: UserInterface,
        walkerFactory: AstWalkerFactory,
        database: Database
    ) {
        this.config = config;
        this.userInterface = userInterface;
        this.database = database;
        this.walkerFactory = walkerFactory;
    }

    public isRunning(): boolean {
        return (
            this.state === FilesystemWatcherState.running ||
            this.state === FilesystemWatcherState.stopping
        );
    }

    private continueRunning(): boolean {
        if (this.fileParsingErrorCnt >= this.config.getFileErrorThreshold()) {
            this.state = FilesystemWatcherState.stopping;
        }

        return this.state === FilesystemWatcherState.running;
    }

    public async startWatching() {
        console.log("Starting ClangFilesystemWatcher.");
        // When the watcher is started, the database might have changed.
        // Whe don't want to directly remove old databases to allow different watchers,
        // as well as different workspace configurations.
        this.state = FilesystemWatcherState.running;
        this.fileParsingErrorCnt = 0;
        this.startWorker();
        this.watchFilesystem();
    }

    private async startWorker() {
        for (let i = 0; i < this.config.getNumOfParserThreads(); i++) {
            this.workerAwaits.push(this.worker(i));
        }
        console.log(`Started ${this.config.getNumOfParserThreads()} workers.`);
    }

    public async stopWatching() {
        this.state = FilesystemWatcherState.stopping;
        console.log("Signaled ClangFilesystemWatcher to stop.");
    }

    private async watchFilesystem() {
        console.log("Filesystem watching thread started.");

        // TODO(#15): Start with an initial compile commands list update.
        // While it looks good to have a fresh list of compile commands,
        // maybe we want to skip this later, so in IDE restarts no full
        // index has to be rebuild all the time.
        if (!(await this.createTasksFromCompileCommands())) {
            console.log("Terminating filesystem watcher.");
            this.state = FilesystemWatcherState.stopping;
            await Promise.all(this.workerAwaits);
            this.state = FilesystemWatcherState.stopped;
            console.log("All workers finished.");
        }

        console.log("Initial reading of compile_commands.json done.");

        while (this.continueRunning()) {
            if (await this.isThereANewCompileCommandsList()) {
                // TODO(#15): Maybe additional steps need to be done here.
                // Should the task list be cleared?
                // Do we need to clean the database?
                // Do we need to stop the workers?
                await this.createTasksFromCompileCommands();
            } else if (await this.searchCppFileChanges()) {
                // Nothing to do here. The actions happens earlier.
            } else {
                await delay(this.config.getFileSystemWatcherWorkerDelay());
            }
        }

        console.log(
            "Filesystem watching thread exited loop. Starting to await workers."
        );

        await Promise.all(this.workerAwaits);
        this.state = FilesystemWatcherState.stopped;

        console.log("All workers finished.");
    }

    private async isThereANewCompileCommandsList(): Promise<boolean> {
        // TODO(#15): Do a proper file check here.
        return false;
    }

    private async createTasksFromCompileCommands(): Promise<boolean> {
        const compileCommandsJsonPath =
            this.config.getCompileCommandsJsonPath();

        try {
            const compileCommandsJson = require(compileCommandsJsonPath.pathString());

            for (const compileCommand of compileCommandsJson) {
                this.workerTasks.push({
                    directory: compileCommand.directory,
                    command: compileCommand.command,
                    file: compileCommand.file,
                });
            }
        } catch (error) {
            const message = `Failed to read "${compileCommandsJsonPath}" or the file is not a valid compile_commands.json file.`;
            console.error(message);
            this.userInterface.logError(message);

            return false;
        }

        return true;
    }

    private async parseCppFile(compileCommand: ICompileCommand) {
        const fileHandle = this.userInterface.createFileAnalysisHandle(
            compileCommand.file,
            compileCommand.command
        );

        const walker = this.walkerFactory.createAstWalker(
            this.database,
            fileHandle
        );

        if (walker === null) {
            this.fileParsingErrorCnt++;
            return;
        }

        walker.walkAst();

        this.analyzedFiles.push({
            file: compileCommand.file,
            command: compileCommand.command,
            lastAnalyzed: Date.now(),
        });
    }

    private async searchCppFileChanges(): Promise<boolean> {
        // TODO(#15): Do a proper file check here.
        // Do we want to check all files during each iteration?

        // TODO(#15): Currently we only track cpp files and no header files.
        // A mechanism to track header files is needed.
        return false;
    }

    private async worker(number: number) {
        console.log(`Worker ${number} started.`);

        while (this.continueRunning()) {
            var task = this.workerTasks.pop();
            if (task !== undefined) {
                await this.parseCppFile(task);
            } else {
                await delay(this.config.getFileSystemWatcherWorkerDelay());
            }
        }

        console.log(`Worker ${number} exited loop.`);
    }
}
