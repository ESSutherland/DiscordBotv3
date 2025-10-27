import { AuditLogEvent, Client, EmbedBuilder, GuildBan } from "discord.js";
import Channels from "../../models/Channels";

export default async (client: Client, ban: GuildBan) => {
  const channelId = await Channels.findOne({
    guildId: ban.guild.id,
    type: "mod",
  });

  if (!channelId) return;

  const modChannel = ban.guild.channels.cache.get(channelId.channelId);

  if (!modChannel || !modChannel.isTextBased()) return;

  const { user, guild } = ban;

  const findBanAuditLog = async (retries = 3, delay = 1000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      const auditLogPromise = await guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanAdd,
        limit: 10,
      });

      const auditLog = auditLogPromise.entries.find(
        (entry) =>
          entry.target?.id === user.id &&
          Date.now() - entry.createdTimestamp < 10000
      );

      if (auditLog) return auditLog;

      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    return null;
  };

  const auditLog = await findBanAuditLog();

  const banGiver = auditLog?.executor;
  const reason = auditLog?.reason || "No reason provided";

  const banEmbed = new EmbedBuilder()
    .setTitle("User Banned!")
    .setDescription(
      banGiver
        ? `${banGiver.toString()} banned ${user.username}`
        : `${user.username} was banned`
    )
    .addFields({
      name: "Reason",
      value: reason,
    })
    .setAuthor({
      name: `${user.username} (${user.id})`,
      iconURL: user.displayAvatarURL(),
    })
    .setColor(guild.members.me?.displayColor || "Red");

  modChannel.send({ embeds: [banEmbed] });
};
