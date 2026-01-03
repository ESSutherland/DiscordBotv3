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
    name: "anime",
    description: "Get information about an anime",
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

    const animeData = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${title}&limit=1`
    );

    if (animeData.data.data.length === 0) {
      return interaction.editReply({
        embeds: [errorEmbed("No anime found with the given parameters.")],
      });
    }

    const anime = animeData.data.data[0];
    const dateFormat = Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    });

    const embed = new EmbedBuilder()
      .setTitle(anime.title)
      .setURL(anime.url)
      .setDescription(anime.title_japanese)
      .addFields([
        {
          name: "Synopsis",
          value: anime.synopsis.substring(0, 200) + "...",
        },
        {
          name: "Episodes",
          value: anime.episodes?.toString() || "N/A",
          inline: true,
        },
        {
          name: "Status",
          value: anime.status || "N/A",
          inline: true,
        },
        {
          name: "Score",
          value: anime.score?.toString() || "N/A",
          inline: true,
        },
      ])
      .setImage(anime.images.jpg.large_image_url || "")
      .setColor(interaction.guild?.members.me?.displayColor || "Blue")
      .setFooter({
        text: `Aired:  ${anime.aired.string} | Rank: #${anime.rank ?? "N/A"}`,
      });

    interaction.editReply({ embeds: [embed] });
  },
};
