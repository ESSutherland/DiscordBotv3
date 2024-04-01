import { Client, Interaction } from "discord.js";
import Roles from "../../models/Roles";

export default async (client: Client, interaction: Interaction) => {
  if (!interaction.isButton() || !interaction.guild || !interaction.member)
    return;

  if (
    interaction.customId !== "live" &&
    interaction.customId !== "movie" &&
    interaction.customId !== "game"
  )
    return;

  if (interaction.customId === "live") {
    interaction.deferUpdate();
    const role = await Roles.findOne({
      guildId: interaction.guild.id,
      type: "live",
    });

    if (!role) return;

    const member = interaction.guild.members.cache.get(
      interaction.member.user.id
    );

    if (!member) return;

    if (member.roles.cache.has(role.roleId)) {
      member.roles.remove(role.roleId);
    } else {
      member.roles.add(role.roleId);
    }
  } else if (interaction.customId === "movie") {
    interaction.deferUpdate();
    const role = await Roles.findOne({
      guildId: interaction.guild.id,
      type: "movie",
    });

    if (!role) return;

    const member = interaction.guild.members.cache.get(
      interaction.member.user.id
    );

    if (!member) return;

    if (member.roles.cache.has(role.roleId)) {
      member.roles.remove(role.roleId);
    } else {
      member.roles.add(role.roleId);
    }
  } else if (interaction.customId === "game") {
    interaction.deferUpdate();
    const role = await Roles.findOne({
      guildId: interaction.guild.id,
      type: "game",
    });

    if (!role) return;

    const member = interaction.guild.members.cache.get(
      interaction.member.user.id
    );

    if (!member) return;

    if (member.roles.cache.has(role.roleId)) {
      member.roles.remove(role.roleId);
    } else {
      member.roles.add(role.roleId);
    }
  }
};
