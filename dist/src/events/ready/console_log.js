"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = async (client) => {
    client.user?.setActivity("In The Snow. | /help", {
        type: discord_js_1.ActivityType.Playing,
    });
    console.log(`✅ ${client.user?.tag} is online!`);
};
