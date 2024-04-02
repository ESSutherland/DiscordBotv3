import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { errorEmbed } from "../../util/embed_helper";

export default {
  data: {
    name: "lookup",
    description: "Look up a user via Discord ID.",
    options: [
      {
        name: "user_id",
        description: "The user ID you want to look up.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  permissionsRequired: [PermissionFlagsBits.BanMembers],

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    const userId = interaction.options.getString("user_id", true);

    const user = await client.users.fetch(userId).catch(() => null);

    if (!user) {
      return interaction.reply({
        embeds: [errorEmbed("User not found.")],
        ephemeral: true,
      });
    }

    const bot = interaction.guild?.members.me;

    const embed = new EmbedBuilder()
      .setDescription(user.toString())
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(),
      })
      .setColor(bot?.displayColor || "Random")
      .setThumbnail(user.displayAvatarURL())
      .addFields({
        name: "Registered",
        value: user.createdAt.toUTCString(),
      });

    interaction.reply({
      embeds: [embed],
    });
  },
};
