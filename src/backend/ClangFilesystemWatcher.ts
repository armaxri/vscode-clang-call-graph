import { IAstWalkerFactory } from "./IAstWalkerFactory";
import { IDatabase } from "./IDatabase";
import { IConfig } from "./IConfig";
import { delay } from "./utils/utils";

enum FilesystemWatcherState {
    initial,
    running,
    stopping,
    stopped,
}

export class ClangFilesystemWatcher {
    private state: FilesystemWatcherState = FilesystemWatcherState.initial;
    private config: IConfig;
    private database: IDatabase;
    private walkerFactory: IAstWalkerFactory;

    constructor(config: IConfig, walkerFactory: IAstWalkerFactory) {
        this.config = config;
        this.database = config.getDatabase();
        this.walkerFactory = walkerFactory;
    }

    public isRunning(): boolean {
        return (
            this.state === FilesystemWatcherState.running ||
            this.state === FilesystemWatcherState.stopping
        );
    }

    public async startWatching() {
        // When the watcher is started, the database might have changed.
        // Whe don't want to directly remove old databases to allow different watchers,
        // as well as different workspace configurations.
        this.database = this.config.getDatabase();
        this.state = FilesystemWatcherState.running;
        this.watchFilesystem();
    }

    public async stopWatching() {
        this.state = FilesystemWatcherState.stopping;
    }

    private async watchFilesystem() {
        while (this.state === FilesystemWatcherState.running) {
            // 0.1 seconds should be an appropriate waiting period for users to feel no delay but still have a good performance.
            await delay(100);
        }
    }
}
