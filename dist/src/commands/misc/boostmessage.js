"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const BoostMessage_1 = require("../../models/BoostMessage");
const embed_helper_1 = require("../../util/embed_helper");
exports.default = {
    data: {
        name: "boostmessage",
        description: "Set the message that will be sent when a user boosts the server",
        options: [
            {
                name: "message",
                description: "The message that will be sent when a user boosts the server",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    requiredPermissions: [discord_js_1.PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.guild)
            return;
        const message = interaction.options.getString("message", true);
        if (message.length > 1024) {
            return interaction.reply({
                content: "The message can't be longer than 1024 characters",
                ephemeral: true,
            });
        }
        await BoostMessage_1.default.findOneAndUpdate({
            guildId: interaction.guild.id,
        }, { guildId: interaction.guild.id, message }, { upsert: true });
        interaction.reply({
            embeds: [(0, embed_helper_1.successEmbed)(interaction, "Boost message has been set")],
            ephemeral: true,
        });
    },
};
