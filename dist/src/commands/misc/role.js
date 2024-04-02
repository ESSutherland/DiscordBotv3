"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Roles_1 = require("../../models/Roles");
const embed_helper_1 = require("../../util/embed_helper");
exports.default = {
    data: {
        name: "role",
        description: "Manage server roles",
        options: [
            {
                name: "set",
                description: "Set a role",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "type",
                        description: "The type of role",
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            {
                                name: "User",
                                value: "user",
                            },
                            {
                                name: "Live",
                                value: "live",
                            },
                            {
                                name: "Game",
                                value: "game",
                            },
                            {
                                name: "Movie",
                                value: "movie",
                            },
                        ],
                    },
                    {
                        name: "role",
                        description: "The role to set",
                        type: discord_js_1.ApplicationCommandOptionType.Role,
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
        await interaction.deferReply();
        const role = interaction.options.getRole("role", true);
        const type = interaction.options.getString("type", true);
        if (!role)
            return interaction.editReply("Role not found.");
        await Roles_1.default.findOneAndUpdate({
            guildId: interaction.guild.id,
            type: type,
        }, {
            guildId: interaction.guild.id,
            roleId: role.id,
            type: type,
        }, {
            upsert: true,
        });
        return interaction.editReply({
            embeds: [
                await (0, embed_helper_1.successEmbed)(interaction, `Role set to ${role.toString()} for \`${type}\`.`),
            ],
        });
    },
};
