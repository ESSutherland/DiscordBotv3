"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Channels_1 = require("../../models/Channels");
const BoostMessage_1 = require("../../models/BoostMessage");
const config_json_1 = require("../../../config.json");
exports.default = async (client, message) => {
    if (message.author.bot)
        return;
    const boostTypes = [
        discord_js_1.MessageType.GuildBoost,
        discord_js_1.MessageType.GuildBoostTier1,
        discord_js_1.MessageType.GuildBoostTier2,
        discord_js_1.MessageType.GuildBoostTier3,
    ];
    if (!boostTypes.find((type) => type === message.type) &&
        config_json_1.devs.find((id) => id !== message.author.id))
        return;
    if (config_json_1.devs.find((id) => id === message.author.id) &&
        message.content !== "boost_test")
        return;
    const guild = message.guild;
    if (!guild)
        return;
    const channelId = await Channels_1.default.findOne({
        guildId: guild.id,
        type: "general",
    });
    if (!channelId)
        return;
    const channel = message.guild.channels.cache.get(channelId.channelId);
    if (!channel || !channel.isTextBased())
        return;
    const existingMessage = await BoostMessage_1.default.findOne({
        guildId: guild.id,
    });
    if (!existingMessage)
        return;
    const boostMessage = existingMessage.message.replace("{user}", message.author.toString());
    channel.send(boostMessage);
};
