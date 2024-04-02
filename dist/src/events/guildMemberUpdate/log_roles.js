"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (client, oldMember, newMember) => {
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
};
