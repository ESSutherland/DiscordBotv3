"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../../../config.json");
const get_local_commands_1 = require("../../util/get_local_commands");
exports.default = async (client, interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    const localCommands = await (0, get_local_commands_1.getLocalCommands)();
    try {
        const commandObject = localCommands.find((c) => c.data.name === interaction.commandName);
        if (!commandObject)
            return;
        if (commandObject.devOnly) {
            if (!config_json_1.devs.includes(interaction.user.id)) {
                interaction.reply({
                    content: "This command is only available to developers",
                    ephemeral: true,
                });
                throw new Error("Command is only available to developers.");
            }
        }
        if (commandObject.testOnly) {
            if (interaction.guildId !== config_json_1.test_server) {
                interaction.reply({
                    content: "This command cannot be ran here.",
                    ephemeral: true,
                });
                throw new Error("Command cannot be ran here.");
            }
        }
        if (commandObject.nitroOnly) {
            const member = await interaction.guild?.members.fetch(interaction.user.id);
            if (!member?.premiumSince && !config_json_1.devs.includes(interaction.user.id)) {
                return interaction.reply({
                    content: "You need to be a Nitro subscriber to use this command!",
                    ephemeral: true,
                });
            }
        }
        commandObject.permissionsRequired?.some((permission) => {
            if (!interaction.memberPermissions?.has(permission)) {
                interaction.reply({
                    content: "You do not have the required permissions to run this command.",
                    ephemeral: true,
                });
                throw new Error("User does not have required permissions.");
            }
        });
        commandObject.botPermissions?.some((permission) => {
            const bot = interaction.guild?.members.me;
            if (!bot?.permissions.has(permission)) {
                interaction.reply({
                    content: "I do not have the required permissions to run this command.",
                    ephemeral: true,
                });
                throw new Error("Bot does not have required permissions.");
            }
        });
        try {
            await commandObject.callback(client, interaction);
            console.log(`🔵 ${interaction.user.username} ran ${commandObject.data.name} command.`);
        }
        catch (error) {
            console.error(error);
        }
    }
    catch (error) {
        console.error(error);
    }
};
