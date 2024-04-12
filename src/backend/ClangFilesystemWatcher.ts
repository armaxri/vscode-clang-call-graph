import { IAstWalkerFactory } from "./IAstWalkerFactory";
import { IDatabase } from "./IDatabase";
import { IConfig } from "./IConfig";
import { delay } from "./utils/utils";
import { IUserInterface } from "./IUserInterface";

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
    private config: IConfig;
    private userInterface: IUserInterface;
    private database: IDatabase;
    private walkerFactory: IAstWalkerFactory;

    // This number is used during busy waiting to avoid high CPU usage.
    // 0.1 seconds should be an appropriate waiting period for users to feel no delay but still have a good performance.
    // It is optionally configurable from the constructor, so that tests can use a lower value,
    // or may even use a higher value to test correct behavior.
    private workerDelay: number = 100;

    // The C and C++ files are analyzed in parallel by a group of workers.
    // This array stores the promises of the workers, so that the main thread can await them on shutdown.
    // The file changes are observed by the starting thread of the startWatching method.
    private workerAwaits: Array<Promise<void>> = new Array<Promise<void>>();
    private workerTasks: Array<ICompileCommand> = new Array<ICompileCommand>();

    private analyzedFiles: Array<AnalyzedFile> = new Array<AnalyzedFile>();

    constructor(
        config: IConfig,
        userInterface: IUserInterface,
        walkerFactory: IAstWalkerFactory,
        database: IDatabase,
        workerDelay?: number
    ) {
        this.config = config;
        this.userInterface = userInterface;
        this.database = database;
        this.walkerFactory = walkerFactory;

        if (workerDelay !== undefined) {
            this.workerDelay = workerDelay;
        }
    }

    public isRunning(): boolean {
        return (
            this.state === FilesystemWatcherState.running ||
            this.state === FilesystemWatcherState.stopping
        );
    }

    public async startWatching() {
        console.log("Starting ClangFilesystemWatcher.");
        // When the watcher is started, the database might have changed.
        // Whe don't want to directly remove old databases to allow different watchers,
        // as well as different workspace configurations.
        this.state = FilesystemWatcherState.running;
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

        // TODO: Start with an initial compile commands list update.
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

        while (this.state === FilesystemWatcherState.running) {
            if (await this.isThereANewCompileCommandsList()) {
                // TODO: Maybe additional steps need to be done here.
                // Should the task list be cleared?
                // Do we need to clean the database?
                // Do we need to stop the workers?
                await this.createTasksFromCompileCommands();
            } else if (await this.searchCppFileChanges()) {
                // Nothing to do here. The actions happens earlier.
            } else {
                await delay(this.workerDelay);
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
        // TODO: Do a proper file check here.
        return false;
    }

    private async createTasksFromCompileCommands(): Promise<boolean> {
        const compileCommandsJsonPath =
            this.config.getCompileCommandsJsonPath();

        try {
            const compileCommandsJson = require(compileCommandsJsonPath);

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
            this.userInterface.displayError(message);

            return false;
        }

        return true;
    }

    private async parseCppFile(compileCommand: ICompileCommand) {
        var walker = this.walkerFactory.createAstWalker(
            compileCommand.file,
            compileCommand.command,
            this.database
        );

        walker.walkAst();

        this.analyzedFiles.push({
            file: compileCommand.file,
            command: compileCommand.command,
            lastAnalyzed: Date.now(),
        });
    }

    private async searchCppFileChanges(): Promise<boolean> {
        // TODO: Do a proper file check here.
        // Do we want to check all files during each iteration?

        // TODO: Currently we only track cpp files and no header files.
        // A mechanism to track header files is needed.
        return false;
    }

    private async worker(number: number) {
        console.log(`Worker ${number} started.`);

        while (this.state === FilesystemWatcherState.running) {
            var task = this.workerTasks.pop();
            if (task !== undefined) {
                await this.parseCppFile(task);
            } else {
                await delay(this.workerDelay);
            }
        }

        console.log(`Worker ${number} exited loop.`);
    }
}
