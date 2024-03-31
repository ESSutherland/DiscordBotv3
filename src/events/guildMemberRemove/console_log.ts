import { Client, GuildMember } from "discord.js";
import { devs } from "../../../config.json";
const updateRoles = async (client: Client, member: GuildMember) => {
  const message = `👋 User ${member.user.username} left the server. ${
    member.pending ? "(Member was pending)" : ""
  }`;
  const guild = member.guild;
  const channel = guild.channels.cache.get("712439399274774588");

  if (!channel || !channel.isTextBased()) return;

  console.log(message);
  channel.send(message);
};

export default updateRoles;
