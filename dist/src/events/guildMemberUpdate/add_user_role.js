"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Roles_1 = require("../../models/Roles");
exports.default = async (client, oldMember, newMember) => {
    if (oldMember.user.bot || newMember.pending)
        return;
    const userRole = await Roles_1.default.findOne({
        guildId: newMember.guild.id,
        type: "user",
    });
    if (!userRole)
        return;
    if (!newMember.roles.cache.find((r) => r.id === userRole.roleId) &&
        !newMember.pending) {
        newMember.roles.add(userRole.roleId);
    }
};
