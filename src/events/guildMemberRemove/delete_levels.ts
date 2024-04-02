import { Client, GuildMember } from "discord.js";
import Level from "../../models/Level";
export default async (client: Client, member: GuildMember) => {
  if (member.user.bot) return;

  const hasLevels = await Level.findOne({
    userId: member.id,
    guildId: member.guild.id,
  });

  if (hasLevels) {
    await Level.deleteOne({
      userId: member.id,
      guildId: member.guild.id,
    });
  }
};
