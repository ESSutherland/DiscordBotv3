import {
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import CustomCommand from "../../models/CustomCommand";
import { errorEmbed, successEmbed } from "../../util/embed_helper";
import { commandMessageData } from "../../util/data";

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
      {
        name: "list",
        description: "List all custom commands",
        type: ApplicationCommandOptionType.Subcommand,
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

    if (subcommand === "list") {
      const commands = await CustomCommand.find({
        guildId: interaction.guild.id,
      }).select("-_id command response authorId");

      if (commands.length === 0) {
        return interaction.editReply({
          embeds: [await errorEmbed("No custom commands found.")],
        });
      }

      const embedPages = await getCommandList(interaction, commands);

      const message = await interaction.fetchReply();

      commandMessageData.push({
        id: message.id,
        index: 0,
        pages: embedPages,
      });

      const prevButton = new ButtonBuilder()
        .setCustomId("prev")
        .setLabel("Previous Page")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(commandMessageData[0].index === 0);

      const nextButton = new ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next Page")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(commandMessageData[0].index === embedPages.length - 1);

      interaction.editReply({
        embeds: [embedPages[0]],
        components: [
          {
            type: 1,
            components: [prevButton, nextButton],
          },
        ],
      });
    }
  },
};

const getCommandList = async (
  interaction: CommandInteraction,
  commandList: any[]
) => {
  const COMMANDS_PER_PAGE = 5;
  const totalPages = Math.ceil(commandList.length / COMMANDS_PER_PAGE);
  const commandListPages: any[] = commandList.reduce((pages, command, i) => {
    if (i % COMMANDS_PER_PAGE === 0) {
      pages.push([]);
    }

    const currentPageIndex = Math.floor(i / COMMANDS_PER_PAGE);
    pages[currentPageIndex].push(command);

    return pages;
  }, []);

  const embedPages = commandListPages.map((commands: any[], i) => {
    const embed = new EmbedBuilder()
      .setTitle("Custom Commands")
      .setColor(interaction.guild?.members.me?.displayColor || "Green")
      .setFooter({
        text: `Page ${i + 1}/${totalPages}`,
      });

    commands.forEach((command, idx) => {
      embed.addFields(
        {
          name: `${idx === 0 ? "Command" : `\u200b`}`,
          value: command.command,
          inline: true,
        },
        {
          name: `${idx === 0 ? "Response" : `\u200b`}`,
          value: command.response,
          inline: true,
        },
        {
          name: `${idx === 0 ? "Author" : `\u200b`}`,
          value: `<@${command.authorId}>`,
          inline: true,
        }
      );
    });

    return embed;
  });

  return embedPages;
};
