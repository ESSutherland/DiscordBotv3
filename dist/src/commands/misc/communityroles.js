"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: {
        name: "communityroles",
        description: "Create comminity roles message",
    },
    requiredPermissions: [discord_js_1.PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.channel || !interaction.guild)
            return;
        const liveButton = new discord_js_1.ButtonBuilder()
            .setLabel("Live Notifications")
            .setCustomId("live")
            .setEmoji("🔴")
            .setStyle(discord_js_1.ButtonStyle.Secondary);
        const movieButton = new discord_js_1.ButtonBuilder()
            .setLabel("Watch Parties")
            .setCustomId("movie")
            .setEmoji("🎥")
            .setStyle(discord_js_1.ButtonStyle.Secondary);
        const gameButton = new discord_js_1.ButtonBuilder()
            .setLabel("Community Games")
            .setCustomId("game")
            .setEmoji("🎮")
            .setStyle(discord_js_1.ButtonStyle.Secondary);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Community Roles")
            .setColor(interaction.guild.members.me?.displayColor || "Random")
            .setDescription("Click the buttons below to add a community role to yourself so you can be notified of community events. You can remove the role by clicking the button again.");
        const message = await interaction.channel.send({
            embeds: [embed],
            components: [
                {
                    type: discord_js_1.ComponentType.ActionRow,
                    components: [liveButton, movieButton, gameButton],
                },
            ],
        });
        interaction.editReply("Done!");
    },
};
