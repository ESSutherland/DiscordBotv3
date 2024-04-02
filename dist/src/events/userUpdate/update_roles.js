"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("../../../config.json");
exports.default = async (client, oldUser, newUser) => {
    if (oldUser.bot)
        return;
    const guild = client.guilds.cache.first();
    if (!guild)
        return;
    const member = guild.members.cache.get(oldUser.id);
    if (!member)
        return;
    if (member.premiumSince ||
        (config_json_1.devs.includes(oldUser.id) && oldUser.username !== newUser.username)) {
        const role = guild.roles.cache.find((r) => r.name === oldUser.username);
        if (!role)
            return;
        role.setName(newUser.username);
        console.log(`💎 Nitro user ${oldUser.username} updated to ${newUser.username}`);
    }
};
