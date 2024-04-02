"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (client, member) => {
    if (member.user.bot)
        return;
    if (member.premiumSince) {
        const role = member.guild.roles.cache.find((r) => r.name === member.user.username);
        if (!role)
            return;
        role.delete();
    }
};
