import { Client, GuildMember, User } from "discord.js";

export default async (
  client: Client,
  oldMember: GuildMember,
  newMember: GuildMember
) => {
  if (oldMember.user.bot) return;

  if (!!oldMember.premiumSince !== !!newMember.premiumSince) {
    const role = oldMember.guild.roles.cache.find(
      (role) => role.name === oldMember.user.username
    );

    if (!role) return;

    role.delete();
  }
};
