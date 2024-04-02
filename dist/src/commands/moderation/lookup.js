"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embed_helper_1 = require("../../util/embed_helper");
exports.default = {
    data: {
        name: "lookup",
        description: "Look up a user via Discord ID.",
        options: [
            {
                name: "user_id",
                description: "The user ID you want to look up.",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    requiredPermissions: [discord_js_1.PermissionFlagsBits.BanMembers],
    callback: async (client, interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        const userId = interaction.options.getString("user_id", true);
        const user = await client.users.fetch(userId).catch(() => null);
        if (!user) {
            return interaction.reply({
                embeds: [(0, embed_helper_1.errorEmbed)("User not found.")],
                ephemeral: true,
            });
        }
        const bot = interaction.guild?.members.me;
        const embed = new discord_js_1.EmbedBuilder()
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
