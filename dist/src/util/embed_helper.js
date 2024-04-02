"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorEmbed = exports.successEmbed = void 0;
const discord_js_1 = require("discord.js");
const successEmbed = (interaction, description, footer, author) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(interaction.guild?.members.me?.displayColor || "Green")
        .setTitle("Success!")
        .setDescription(description);
    if (footer)
        embed.setFooter({
            text: footer,
        });
    return embed;
};
exports.successEmbed = successEmbed;
const errorEmbed = (description) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor("Red")
        .setTitle("Failed!")
        .setDescription(description);
    return embed;
};
exports.errorEmbed = errorEmbed;
