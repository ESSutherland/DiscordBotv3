import { Client, GuildMember } from "discord.js";
import Channels from "../../models/Channels";
export default async (client: Client, member: GuildMember) => {
  const message = `👋 User ${member.user.username} (${
    member.displayName
  }) left the server. ${member.pending ? "(Member was pending)" : ""}`;
  const guild = member.guild;
  const channelId = await Channels.findOne({
    guildId: guild.id,
    type: "admin",
  });

  if (!channelId) return;

  const channel = guild.channels.cache.get(channelId.channelId);

  if (!channel || !channel.isTextBased()) return;

  console.log(message);
  channel.send(message);
};
