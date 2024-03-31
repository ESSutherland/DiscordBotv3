import { AnimeClient, Anime } from "@tutkli/jikan-ts";
import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Get information about an anime")
    .addStringOption((option) =>
      option
        .setName("params")
        .setDescription("The parameters to search for")
        .setRequired(true)
    ),

  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const title = interaction.options.get("params")?.value as string;

    const animeClient = new AnimeClient();

    const animeData = await animeClient.getAnimeSearch({ q: title, limit: 1 });

    if (animeData.data.length === 0) {
      return interaction.editReply("No anime found with that title");
    }

    const anime: Anime = animeData.data[0];
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
          value: anime.episodes.toString() || "N/A",
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
        text: `Aired:  ${dateFormat.format(new Date(anime.aired.from))} ${
          anime.aired.to
            ? "- " + dateFormat.format(new Date(anime.aired.to))
            : ""
        }`,
      });

    interaction.editReply({ embeds: [embed] });
  },
};
