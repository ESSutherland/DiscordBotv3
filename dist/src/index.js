"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const event_handler_1 = require("./handlers/event_handler");
const mongoose_1 = require("mongoose");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.IntentsBitField.Flags.Guilds,
        discord_js_1.IntentsBitField.Flags.GuildMessages,
        discord_js_1.IntentsBitField.Flags.GuildMembers,
        discord_js_1.IntentsBitField.Flags.MessageContent,
        discord_js_1.IntentsBitField.Flags.GuildModeration,
        discord_js_1.IntentsBitField.Flags.GuildPresences,
        discord_js_1.IntentsBitField.Flags.GuildEmojisAndStickers,
    ],
});
(async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI, {});
        console.log("Connected to MongoDB");
        (0, event_handler_1.eventHandler)(client);
        client.login(process.env.BOT_TOKEN);
    }
    catch (error) {
        console.error(error);
    }
})();
