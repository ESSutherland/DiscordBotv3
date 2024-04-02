"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("../../../config.json");
const embed_helper_1 = require("../../util/embed_helper");
exports.default = {
    data: {
        name: "bot",
        description: "Get bot information",
    },
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const user = await client.users.fetch(config_json_1.devs[0]);
        if (!user)
            return interaction.editReply({
                embeds: [(0, embed_helper_1.errorEmbed)("Error fetching bot data.")],
            });
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(client.user?.displayName || "Bot")
            .setDescription(`This bot was made by ${user.toString()} in TypeScript using Discord.js v14.`)
            .setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL(),
        })
            .setColor(interaction.guild?.members.me?.displayColor || "Random")
            .addFields([
            {
                name: "Twitch",
                value: "https://twitch.tv/SpiderPigEthan",
            },
            {
                name: "Twitter",
                value: "https://twitter.com/SpiderPigEthan",
            },
        ]);
        return interaction.editReply({ embeds: [embed] });
    },
};
