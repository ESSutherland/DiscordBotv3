import axios from "axios";
import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { errorEmbed } from "../../util/embed_helper";

export default {
  data: {
    name: "manga",
    description: "Get information about a manga",
    options: [
      {
        name: "params",
        description: "The parameters to search for",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    await interaction.deferReply();

    const title = interaction.options.getString("params", true);

    const mangaData = await axios.get(
      `https://api.jikan.moe/v4/manga?q=${title}&limit=1`
    );

    if (mangaData.data.data.length === 0) {
      return interaction.editReply({
        embeds: [errorEmbed("No manga found with the given parameters.")],
      });
    }

    const manga = mangaData.data.data[0];
    const dateFormat = Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    });

    const embed = new EmbedBuilder()
      .setTitle(manga.title)
      .setURL(manga.url)
      .setDescription(manga.title_japanese)
      .addFields([
        {
          name: "Synopsis",
          value: manga.synopsis.substring(0, 200) + "...",
        },
        {
          name: "Volumes",
          value: (manga.volumes || "N/A").toString(),
          inline: true,
        },
        {
          name: "Status",
          value: manga.status || "N/A",
          inline: true,
        },
        {
          name: "Score",
          value: manga.score?.toString() || "N/A",
          inline: true,
        },
      ])
      .setImage(manga.images.jpg.large_image_url || "")
      .setColor(interaction.guild?.members.me?.displayColor || "Blue")
      .setFooter({
        text: `Published:  ${dateFormat.format(
          new Date(manga.published.from)
        )} ${
          manga.published.to
            ? "- " + dateFormat.format(new Date(manga.published.to))
            : ""
        }`,
      });

    interaction.editReply({ embeds: [embed] });
  },
};
