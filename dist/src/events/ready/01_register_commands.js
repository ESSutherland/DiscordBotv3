"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../../../config.json");
const get_local_commands_1 = require("../../util/get_local_commands");
const get_application_commands_1 = require("../../util/get_application_commands");
const are_commands_different_1 = require("../../util/are_commands_different");
exports.default = async (client) => {
    try {
        let localCommands = await (0, get_local_commands_1.getLocalCommands)();
        localCommands = localCommands.filter((command) => command !== null);
        const applicationCommands = await (0, get_application_commands_1.getApplicationCommands)(client, config_json_1.test_server);
        if (!applicationCommands) {
            console.error("❌ Could not fetch application commands.");
            return;
        }
        localCommands.forEach(async (command) => {
            const { name, description, options } = command.data;
            const existingCommand = applicationCommands.cache.find((cmd) => cmd.name === name);
            if (existingCommand) {
                if (command.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`🗑️ Deleted command: ${name}`);
                    return;
                }
                if ((0, are_commands_different_1.areCommandsDifferent)(existingCommand, command.data)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });
                }
            }
            else {
                if (command.deleted) {
                    return;
                }
                await applicationCommands.create({
                    name,
                    description,
                    options,
                });
                console.log(`🆕 Created command: ${name}`);
            }
        });
        applicationCommands.cache.forEach(async (command) => {
            if (!localCommands.find((cmd) => cmd.data.name === command.name)) {
                await applicationCommands.delete(command.id);
                console.log(`🗑️ Deleted command: ${command.name}`);
            }
        });
    }
    catch (error) {
        console.error(error);
    }
};
