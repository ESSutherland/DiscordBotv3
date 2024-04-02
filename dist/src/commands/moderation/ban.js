"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embed_helper_1 = require("../../util/embed_helper");
exports.default = {
    data: {
        name: "ban",
        description: "Ban a user.",
        options: [
            {
                name: "user-id",
                description: "The id of the user you want to ban.",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "reason",
                description: "The reason for the ban.",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "delete",
                description: "Delete user's messages from the past 7 days.",
                type: discord_js_1.ApplicationCommandOptionType.Boolean,
                required: false,
            },
        ],
    },
    permissionsRequired: [discord_js_1.PermissionFlagsBits.BanMembers],
    botPermissions: [discord_js_1.PermissionFlagsBits.BanMembers],
    callback: async (client, interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.inGuild())
            return;
        const userId = interaction.options.getString("user-id", true);
        if (!userId) {
            return interaction.reply({
                embeds: [(0, embed_helper_1.errorEmbed)("Invalid user ID.")],
            });
        }
        const user = await client.users.fetch(userId);
        const reason = `${interaction.user.username}:  ${interaction.options.getString("reason") || "No reason provided."}`;
        const deleteMessages = interaction.options.getBoolean("delete") || false;
        if (!user)
            return;
        await interaction.guild?.members.ban(user, {
            reason: reason,
            deleteMessageSeconds: deleteMessages ? 86_400 : 0,
        });
        interaction.reply({
            embeds: [
                (0, embed_helper_1.successEmbed)(interaction, `Successfully banned user: \`${user.tag}\`.`, `ID: ${user.id}`, user),
            ],
        });
    },
};
