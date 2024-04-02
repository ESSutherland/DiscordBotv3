"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Channels_1 = require("../../models/Channels");
const embed_helper_1 = require("../../util/embed_helper");
exports.default = {
    data: {
        name: "channel",
        description: "Manage server channels",
        options: [
            {
                name: "set",
                description: "Set a channel",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "type",
                        description: "The type of channel",
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            {
                                name: "General",
                                value: "general",
                            },
                            {
                                name: "Mod",
                                value: "mod",
                            },
                            {
                                name: "Admin",
                                value: "admin",
                            },
                            {
                                name: "Bot",
                                value: "bot",
                            },
                        ],
                    },
                    {
                        name: "channel",
                        description: "The channel to set",
                        type: discord_js_1.ApplicationCommandOptionType.Channel,
                        required: true,
                    },
                ],
            },
        ],
    },
    requiredPermissions: [discord_js_1.PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.guild)
            return;
        const channel = interaction.options.getChannel("channel", true);
        if (!channel)
            return;
        if (channel.type !== discord_js_1.ChannelType.GuildText) {
            return interaction.reply({
                embeds: [(0, embed_helper_1.errorEmbed)("Channel must be a text channel.")],
                ephemeral: true,
            });
        }
        await interaction.deferReply();
        const type = interaction.options.getString("type", true);
        const channelData = await Channels_1.default.findOne({
            guildId: interaction.guild.id,
            type: type,
        });
        if (channelData) {
            channelData.channelId = channel.id;
            await channelData.save();
        }
        else {
            await Channels_1.default.create({
                guildId: interaction.guild.id,
                channelId: channel.id,
                type: type,
            });
        }
        return interaction.editReply({
            embeds: [
                (0, embed_helper_1.successEmbed)(interaction, `Channel set to ${channel.toString()} for \`${type}\`.`),
            ],
        });
    },
};
