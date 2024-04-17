import { Client, GuildMember, User } from "discord.js";
import Roles from "../../models/Roles";
import MinecraftUsers from "../../models/MinecraftUsers";
import { Rcon } from "rcon-client";

export default async (
  client: Client,
  oldMember: GuildMember,
  newMember: GuildMember
) => {
  if (oldMember.user.bot) return;

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    const role = oldMember.roles.cache.find(
      (role) => !newMember.roles.cache.has(role.id)
    );

    if (!role) return;

    const subRole = Roles.findOne({
      roleId: role.id,
      guildId: oldMember.guild.id,
    });

    if (!subRole) return;

    const mcData = await MinecraftUsers.findOne({
      guildId: oldMember.guild.id,
      userId: oldMember.id,
    });

    if (!mcData) return;

    const rcon = await Rcon.connect({
      host: process.env.RCON_IP!,
      password: process.env.RCON_PASSWORD!,
      port: Number(process.env.RCON_PORT!),
    });

    await rcon.send(`whitelist remove ${mcData.minecraftUsername}`);
    rcon.end();

    await MinecraftUsers.deleteOne({
      guildId: mcData.guildId,
      userId: mcData.userId,
    });
  }
};
