import { Client, Interaction } from "discord.js";
import Roles from "../../models/Roles";
import { successEmbed } from "../../util/embed_helper";

export default async (client: Client, interaction: Interaction) => {
  if (!interaction.isButton() || !interaction.guild || !interaction.member)
    return;

  if (
    interaction.customId !== "live" &&
    interaction.customId !== "movie" &&
    interaction.customId !== "game"
  )
    return;

  await interaction.deferReply({ ephemeral: true });

  let roleId;

  if (interaction.customId === "live") {
    const id = await Roles.findOne({
      guildId: interaction.guild.id,
      type: "live",
    });
    roleId = id;
  } else if (interaction.customId === "movie") {
    const id = await Roles.findOne({
      guildId: interaction.guild.id,
      type: "movie",
    });
    roleId = id;
  } else if (interaction.customId === "game") {
    const id = await Roles.findOne({
      guildId: interaction.guild.id,
      type: "game",
    });
    roleId = id;
  }

  if (!roleId) return;

  const role = interaction.guild.roles.cache.get(roleId.roleId);

  if (!role) return;

  const member = interaction.guild.members.cache.get(
    interaction.member.user.id
  );

  if (!member) return;

  if (member.roles.cache.has(roleId.roleId)) {
    member.roles.remove(roleId.roleId);
    interaction.editReply({
      embeds: [
        successEmbed(
          interaction,
          `You have removed the role ${role.toString()}.`
        ),
      ],
    });
  } else {
    member.roles.add(roleId.roleId);
    interaction.editReply({
      embeds: [
        successEmbed(
          interaction,
          `You have added the role ${role.toString()}.`
        ),
      ],
    });
  }
};
