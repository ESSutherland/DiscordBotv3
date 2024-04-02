"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateRoles = async (client, oldMember, newMember) => {
    if (oldMember.user.bot)
        return;
    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        const role = oldMember.roles.cache.find((role) => !newMember.roles.cache.has(role.id));
        if (!role)
            return;
        console.log(`*️⃣  User ${oldMember.user.username} lost role "${role.name}"`);
    }
    else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const role = newMember.roles.cache.find((role) => !oldMember.roles.cache.has(role.id));
        if (!role)
            return;
        console.log(`*️⃣  User ${oldMember.user.username} gained role "${role.name}"`);
    }
    if (!!oldMember.premiumSince !== !!newMember.premiumSince) {
        const role = oldMember.guild.roles.cache.find((role) => role.name === oldMember.user.username);
        if (!role)
            return;
        role.delete();
    }
};
exports.default = updateRoles;
