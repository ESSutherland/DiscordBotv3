import { Client, GuildMember } from "discord.js";
import { devs } from "../../../config.json";
export default async (client: Client, member: GuildMember) => {
  if (member.user.bot) return;

  if (member.premiumSince) {
    const role = member.guild.roles.cache.find(
      (r) => r.name === member.user.username
    );

    if (!role) return;

    role.delete();
  }
};
