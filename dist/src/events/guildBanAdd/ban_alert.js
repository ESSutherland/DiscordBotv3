"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = async (client, ban) => {
    const channelId = "712439399274774588";
    const modChannel = ban.guild.channels.cache.get(channelId);
    if (!modChannel || !modChannel.isTextBased())
        return;
    const { user, guild } = ban;
    let auditLogPromise = await guild.fetchAuditLogs({
        type: discord_js_1.AuditLogEvent.MemberBanAdd,
        limit: 1,
    });
    const auditLog = auditLogPromise.entries.first();
    if (!auditLog)
        return;
    const banGiver = auditLog.executor;
    const banEmbed = new discord_js_1.EmbedBuilder()
        .setTitle("User Banned!")
        .setDescription(`${banGiver?.toString()} banned ${user.username}`)
        .addFields({
        name: "Reason",
        value: auditLog.reason || "No reason provided",
    })
        .setAuthor({
        name: `${user.username} (${user.id})`,
        iconURL: user.displayAvatarURL(),
    })
        .setColor(guild.members.me?.displayColor || "Red");
    modChannel.send({ embeds: [banEmbed] });
};