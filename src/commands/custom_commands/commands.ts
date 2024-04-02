import {
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { commandMessageData } from "../../util/data";
import { errorEmbed } from "../../util/embed_helper";
import CustomCommand from "../../models/CustomCommand";

export default {
  data: {
    name: "commands",
    description: "Get list of custom commands",
  },

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand() || !interaction.guild) return;

    await interaction.deferReply();

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
