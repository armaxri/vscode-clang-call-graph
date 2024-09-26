import { Config } from "../Config";
import { UserInterface } from "../UserInterface";
import { Database } from "../database/Database";
import { Location } from "../database/cpp_structure";
import { getBestMatch } from "../database/helper/location_helper";
import { FileType, getFileType } from "../utils/cpp_file_ending_helper";
import { CancellationToken } from "./CancellationToken";
import { TreeItem } from "./TreeItem";

export class BaseRequestHandler {
    protected config: Config;
    protected database: Database;
    protected userInterface: UserInterface;

    constructor(
        config: Config,
        database: Database,
        userInterface: UserInterface
    ) {
        this.config = config;
        this.database = database;
        this.userInterface = userInterface;
    }

    public getTreeItem(
        documentName: string,
        location: Location,
        cancellationToken: CancellationToken
    ): TreeItem | null {
        console.log(
            `Got initial request for "${documentName}" at ${location.line}:${location.column}.`
        );

        const file =
            getFileType(documentName) === FileType.source
                ? this.database.getCppFile(documentName)
                : this.database.getHppFile(documentName);

        if (!file) {
            const message = `File not found in parsed files database "${documentName}".`;

            this.userInterface.logError(message);

            if (this.config.runVerbose()) {
                console.log(message);
            }

            return null;
        }

        const matchingFuncElements = file.getMatchingFuncs(location);

        if (matchingFuncElements.length === 0) {
            const message = `No function name found at location ${location.line}:${location.column}.`;

            this.userInterface.logError(message);

            if (this.config.runVerbose()) {
                console.log(message);
            }

            return null;
        }

        const bestMatchingFuncElement = getBestMatch(matchingFuncElements);

        return new TreeItem(
            this.config,
            this.database,
            bestMatchingFuncElement
        );
    }
}
