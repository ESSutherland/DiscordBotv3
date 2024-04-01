import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { errorEmbed, successEmbed } from "../../util/embed_helper";

export default {
  data: {
    name: "ban",
    description: "Ban a user.",
    options: [
      {
        name: "user-id",
        description: "The id of the user you want to ban.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "reason",
        description: "The reason for the ban.",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
      {
        name: "delete",
        description: "Delete user's messages from the past 7 days.",
        type: ApplicationCommandOptionType.Boolean,
        required: false,
      },
    ],
  },

  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand() || !interaction.inGuild()) return;

    const userId = interaction.options.getString("user-id", true);

    if (!userId) {
      return interaction.reply({
        embeds: [errorEmbed("Invalid user ID.")],
      });
    }

    const user = await client.users.fetch(userId);

    const reason = `${interaction.user.username}:  ${
      interaction.options.getString("reason") || "No reason provided."
    }`;
    const deleteMessages = interaction.options.getBoolean("delete") || false;

    if (!user) return;

    await interaction.guild?.members.ban(user, {
      reason: reason,
      deleteMessageSeconds: deleteMessages ? 86_400 : 0,
    });

    interaction.reply({
      embeds: [
        successEmbed(
          interaction,
          `Successfully banned user: \`${user.tag}\`.`,
          `ID: ${user.id}`,
          user
        ),
      ],
    });
  },
};
