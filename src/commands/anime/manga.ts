import { MangaClient, Manga } from "@tutkli/jikan-ts";
import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("manga")
    .setDescription("Get information about an manga")
    .addStringOption((option) =>
      option
        .setName("params")
        .setDescription("The parameters to search for")
        .setRequired(true)
    ),

  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const title = interaction.options.get("params")?.value as string;

    const mangaClient = new MangaClient();

    const mangaData = await mangaClient.getMangaSearch({ q: title, limit: 1 });

    if (mangaData.data.length === 0) {
      return interaction.editReply("No manga found with that title");
    }

    const manga: Manga = mangaData.data[0];
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
