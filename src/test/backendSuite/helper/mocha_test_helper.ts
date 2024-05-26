export function addSuitesInSubDirsSuites(directory: string) {
    const fs = require("fs");
    const path = require("path");

    fs.readdirSync(directory).forEach((file: string) => {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory()) {
            fs.readdirSync(filePath).forEach((file: string) => {
                const innerFilePath = path.join(filePath, file);
                if (
                    !fs.statSync(innerFilePath).isDirectory() &&
                    file.endsWith(".suite.js")
                ) {
                    require(innerFilePath);
                }
            });
        }
    });
}
