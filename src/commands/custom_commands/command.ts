import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import CustomCommand from "../../models/CustomCommand";
import { errorEmbed, successEmbed } from "../../util/embed_helper";

export default {
  data: {
    name: "command",
    description: "Manage custom commands",
    options: [
      {
        name: "create",
        description: "Create a custom command",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "command",
            description: "The command name",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "response",
            description: "The response to the command",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "delete",
        description: "Delete a custom command",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "command",
            description: "The command name",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
    ],
  },

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand() || !interaction.guild) return;
    const subcommand = interaction.options.getSubcommand();

    await interaction.deferReply();

    if (subcommand === "create") {
      const command = interaction.options.getString("command", true);
      const response = interaction.options.getString("response", true);

      const existingCommand = await CustomCommand.findOne({
        guildId: interaction.guild.id,
        command,
      });

      if (existingCommand) {
        return interaction.editReply({
          embeds: [await errorEmbed(`Command \`${command}\` already exists.`)],
        });
      }

      await CustomCommand.create({
        authorId: interaction.user.id,
        guildId: interaction.guild.id,
        command,
        response,
      });

      interaction.editReply({
        embeds: [
          await successEmbed(interaction, `Command \`${command}\` created.`),
        ],
      });
    } else if (subcommand === "delete") {
      const command = interaction.options.getString("command", true);

      const existingCommand = await CustomCommand.findOne({
        guildId: interaction.guild.id,
        command,
      });

      if (!existingCommand) {
        return interaction.editReply({
          embeds: [await errorEmbed(`Command \`${command}\` not found.`)],
        });
      }

      await CustomCommand.deleteOne({
        guildId: interaction.guild.id,
        command,
      });

      interaction.editReply({
        embeds: [
          await successEmbed(interaction, `Command \`${command}\` deleted.`),
        ],
      });
    }
  },
};
