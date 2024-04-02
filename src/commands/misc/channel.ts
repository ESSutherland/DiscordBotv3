import {
  ApplicationCommandOptionType,
  ChannelType,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import Channels from "../../models/Channels";
import { errorEmbed, successEmbed } from "../../util/embed_helper";

export default {
  data: {
    name: "channel",
    description: "Manage server channels",
    options: [
      {
        name: "set",
        description: "Set a channel",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "type",
            description: "The type of channel",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              {
                name: "General",
                value: "general",
              },
              {
                name: "Mod",
                value: "mod",
              },
              {
                name: "Admin",
                value: "admin",
              },
              {
                name: "Bot",
                value: "bot",
              },
            ],
          },
          {
            name: "channel",
            description: "The channel to set",
            type: ApplicationCommandOptionType.Channel,
            required: true,
          },
        ],
      },
    ],
  },
  requiredPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand() || !interaction.guild) return;

    const channel = interaction.options.getChannel("channel", true);
    if (!channel) return;

    if (channel.type !== ChannelType.GuildText) {
      return interaction.reply({
        embeds: [errorEmbed("Channel must be a text channel.")],
        ephemeral: true,
      });
    }
    await interaction.deferReply();
    const type = interaction.options.getString("type", true);

    const channelData = await Channels.findOne({
      guildId: interaction.guild.id,
      type: type,
    });

    if (channelData) {
      channelData.channelId = channel.id;
      await channelData.save();
    } else {
      await Channels.create({
        guildId: interaction.guild.id,
        channelId: channel.id,
        type: type,
      });
    }

    return interaction.editReply({
      embeds: [
        successEmbed(
          interaction,
          `Channel set to ${channel.toString()} for \`${type}\`.`
        ),
      ],
    });
  },
};
