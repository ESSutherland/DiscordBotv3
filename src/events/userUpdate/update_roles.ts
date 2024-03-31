import { Client, User } from "discord.js";
import { devs } from "../../../config.json";
const updateRoles = async (client: Client, oldUser: User, newUser: User) => {
  if (oldUser.bot) return;

  const guild = client.guilds.cache.first();

  if (!guild) return;

  const member = guild.members.cache.get(oldUser.id);

  if (!member) return;

  if (
    member.premiumSince ||
    (devs.includes(oldUser.id) && oldUser.username !== newUser.username)
  ) {
    const role = guild.roles.cache.find((r) => r.name === oldUser.username);

    if (!role) return;

    role.setName(newUser.username);

    console.log(
      `💎 Nitro user ${oldUser.username} updated to ${newUser.username}`
    );
  }
};

export default updateRoles;
