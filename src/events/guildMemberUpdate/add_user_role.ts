import { Client, GuildMember, User } from "discord.js";
import Roles from "../../models/Roles";

export default async (
  client: Client,
  oldMember: GuildMember,
  newMember: GuildMember
) => {
  if (oldMember.user.bot || newMember.pending) return;

  const userRole = await Roles.findOne({
    guildId: newMember.guild.id,
    type: "user",
  });

  if (!userRole) return;

  if (
    !newMember.roles.cache.find((r) => r.id === userRole.roleId) &&
    !newMember.pending
  ) {
    newMember.roles.add(userRole.roleId);
  }
};
