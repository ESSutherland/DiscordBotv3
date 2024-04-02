"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventHandler = void 0;
const get_files_1 = require("../util/get_files");
const path = require("path");
const eventHandler = async (client) => {
    const eventFolders = (0, get_files_1.getFiles)(path.join(__dirname, "../events"), true);
    eventFolders.forEach((folder, index) => {
        const eventFiles = (0, get_files_1.getFiles)(folder);
        eventFiles.sort((a, b) => a.localeCompare(b));
        const eventName = eventFolders[index].replace(/\\/g, "/").split("/").pop();
        console.log(`📁 Loading ${eventFiles.length} files for ${eventName}`);
        if (!eventName)
            return;
        client.on(eventName, async (...arg) => {
            eventFiles.forEach(async (file) => {
                const eventFunction = await Promise.resolve(`${"file://" + file}`).then(s => require(s));
                eventFunction.default(client, ...arg);
            });
        });
    });
};
exports.eventHandler = eventHandler;
