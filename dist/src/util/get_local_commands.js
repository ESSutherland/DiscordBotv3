"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalCommands = void 0;
const path = require("path");
const get_files_1 = require("./get_files");
const getLocalCommands = async (exceptions) => {
    let localCommands = [];
    const commandCategories = (0, get_files_1.getFiles)(path.join(__dirname, "../commands"), true);
    commandCategories.forEach((category) => {
        const commandFiles = (0, get_files_1.getFiles)(category);
        let commandPromises = commandFiles.map(async (command) => {
            const commandImport = await Promise.resolve(`${"file://" + command}`).then(s => require(s));
            const commandObject = commandImport.default;
            if (exceptions?.includes(commandObject.data.name)) {
                return null;
            }
            return commandObject;
        });
        localCommands.push(...commandPromises);
    });
    return await Promise.all(localCommands);
};
exports.getLocalCommands = getLocalCommands;
