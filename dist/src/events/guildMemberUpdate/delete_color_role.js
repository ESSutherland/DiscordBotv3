"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (client, oldMember, newMember) => {
    if (oldMember.user.bot)
        return;
    if (!!oldMember.premiumSince !== !!newMember.premiumSince) {
        const role = oldMember.guild.roles.cache.find((role) => role.name === oldMember.user.username);
        if (!role)
            return;
        role.delete();
    }
};
