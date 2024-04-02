"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CustomCommand_1 = require("../../models/CustomCommand");
exports.default = async (client, message) => {
    if (!message.inGuild() || message.author.bot)
        return;
    const customCommand = await CustomCommand_1.default.findOne({
        guildId: message.guild.id,
        command: message.content,
    });
    if (!customCommand)
        return;
    else {
        const response = customCommand.response.replace(/{user}/g, message.author.toString());
        message.channel.send(response);
    }
};
