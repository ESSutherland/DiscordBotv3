"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jikan_ts_1 = require("@tutkli/jikan-ts");
const discord_js_1 = require("discord.js");
exports.default = {
    data: {
        name: "anime",
        description: "Get information about an anime",
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
        const animeClient = new jikan_ts_1.AnimeClient();
        const animeData = await animeClient.getAnimeSearch({ q: title, limit: 1 });
        if (animeData.data.length === 0) {
            return interaction.editReply("No anime found with that title");
        }
        const anime = animeData.data[0];
        const dateFormat = Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
        });
        const embed = new discord_js_1.EmbedBuilder()
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
            text: `Aired:  ${dateFormat.format(new Date(anime.aired.from))} ${anime.aired.to
                ? "- " + dateFormat.format(new Date(anime.aired.to))
                : ""}`,
        });
        interaction.editReply({ embeds: [embed] });
    },
};
