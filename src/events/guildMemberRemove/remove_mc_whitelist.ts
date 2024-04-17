import { Client, GuildMember } from "discord.js";
import MinecraftUsers from "../../models/MinecraftUsers";
import { Rcon } from "rcon-client";
export default async (client: Client, member: GuildMember) => {
  if (member.user.bot) return;

  const mcData = await MinecraftUsers.findOne({
    guildId: member.guild.id,
    userId: member.id,
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
};
