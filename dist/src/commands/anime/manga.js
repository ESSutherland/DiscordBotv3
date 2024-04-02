"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jikan_ts_1 = require("@tutkli/jikan-ts");
const discord_js_1 = require("discord.js");
exports.default = {
    data: {
        name: "manga",
        description: "Get information about an manga",
        options: [
            {
                name: "params",
                description: "The parameters to search for",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    callback: async (client, interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        await interaction.deferReply();
        const title = interaction.options.getString("params", true);
        const mangaClient = new jikan_ts_1.MangaClient();
        const mangaData = await mangaClient.getMangaSearch({ q: title, limit: 1 });
        if (mangaData.data.length === 0) {
            return interaction.editReply("No manga found with that title");
        }
        const manga = mangaData.data[0];
        const dateFormat = Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
        });
        const embed = new discord_js_1.EmbedBuilder()
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
            text: `Published:  ${dateFormat.format(new Date(manga.published.from))} ${manga.published.to
                ? "- " + dateFormat.format(new Date(manga.published.to))
                : ""}`,
        });
        interaction.editReply({ embeds: [embed] });
    },
};
