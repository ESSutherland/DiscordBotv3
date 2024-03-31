import {
  Client,
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { errorEmbed, successEmbed } from "../../util/embed_helper";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user.")
    .addStringOption((option) =>
      option
        .setName("user-id")
        .setDescription("The id of the user you want to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("The reason for the ban.")
    )
    .addBooleanOption((option) =>
      option
        .setName("delete")
        .setDescription("Delete user's messages from the past 7 days.")
    ),
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  callback: async (client: Client, interaction: CommandInteraction) => {
    const userId = interaction.options.get("user-id")?.value as string;

    if (!userId) {
      return interaction.reply({
        embeds: [errorEmbed("Invalid user ID.")],
      });
    }

    const user = await client.users.fetch(userId);

    const reason = `${interaction.user.username}:  ${
      interaction.options.get("reason")?.value as string
    }`;
    const deleteMessages = interaction.options.get("delete")?.value as boolean;

    if (!user) return;

    await interaction.guild?.members.ban(user, {
      reason: reason,
      deleteMessageSeconds: deleteMessages ? 86_400 : 0,
    });

    interaction.reply({
      embeds: [
        successEmbed(
          interaction,
          `Successfully banned user: ${"`" + user.tag + "`"}.`,
          `ID: ${user.id}`,
          user
        ),
      ],
    });
  },
};
