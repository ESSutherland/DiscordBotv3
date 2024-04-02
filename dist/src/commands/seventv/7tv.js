"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const discord_js_1 = require("discord.js");
const sharp = require("sharp");
exports.default = {
    data: {
        name: "7tv",
        description: "Add a 7tv emote to the server.",
        options: [
            {
                name: "emote_id",
                description: "The id of the 7TV emote to add.",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "name",
                description: "The name of the emote.",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "animated",
                description: "Whether the emote is animated or not.",
                type: discord_js_1.ApplicationCommandOptionType.Boolean,
                required: true,
            },
        ],
    },
    requiredPermissions: ["MANAGE_EMOJIS_AND_STICKERS"],
    callback: async (client, interaction) => {
        if (!interaction.isChatInputCommand() ||
            !interaction.inGuild() ||
            !interaction.guild)
            return;
        await interaction.deferReply();
        const emoteId = interaction.options.getString("emote_id", true);
        const name = interaction.options.getString("name", true);
        const animated = interaction.options.getBoolean("animated") || false;
        const image = await axios_1.default.get(`https://cdn.7tv.app/emote/${emoteId}/1x.webp`, { responseType: "arraybuffer" });
        let emoteData = await uploadEmote(interaction, image.data, name, animated, [32, 32]);
        if (!emoteData) {
            return await interaction.editReply({
                content: "Failed to add the 7TV emote.",
            });
        }
        await interaction.editReply({
            content: "Successfully added the 7TV emote.",
        });
    },
};
const uploadEmote = async (interaction, image, name, animated, size) => {
    let emoteData;
    const buffer = await sharp(image, { animated })
        .toFormat(animated ? "gif" : "png")
        .resize(...size)
        .toBuffer()
        .then();
    try {
        emoteData = await interaction.guild?.emojis.create({
            name,
            attachment: buffer,
        });
    }
    catch (error) {
        uploadEmote(interaction, image, name, true, [size[0] - 2, size[1] - 2]);
    }
    return emoteData;
};
