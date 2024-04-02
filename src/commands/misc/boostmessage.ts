import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import BoostMessage from "../../models/BoostMessage";
import { successEmbed } from "../../util/embed_helper";

export default {
  data: {
    name: "boostmessage",
    description:
      "Set the message that will be sent when a user boosts the server",
    options: [
      {
        name: "message",
        description:
          "The message that will be sent when a user boosts the server",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  requiredPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand() || !interaction.guild) return;

    const message = interaction.options.getString("message", true);

    if (message.length > 1024) {
      return interaction.reply({
        content: "The message can't be longer than 1024 characters",
        ephemeral: true,
      });
    }

    await BoostMessage.findOneAndUpdate(
      {
        guildId: interaction.guild.id,
      },
      { guildId: interaction.guild.id, message },
      { upsert: true }
    );

    interaction.reply({
      embeds: [successEmbed(interaction, "Boost message has been set")],
      ephemeral: true,
    });
  },
};