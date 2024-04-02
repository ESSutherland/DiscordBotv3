"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const CustomCommand_1 = require("../../models/CustomCommand");
const embed_helper_1 = require("../../util/embed_helper");
const data_1 = require("../../util/data");
exports.default = {
    data: {
        name: "command",
        description: "Manage custom commands",
        options: [
            {
                name: "create",
                description: "Create a custom command",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "command",
                        description: "The command name",
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: "response",
                        description: "The response to the command",
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
            },
            {
                name: "delete",
                description: "Delete a custom command",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "command",
                        description: "The command name",
                        type: discord_js_1.ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
            },
            {
                name: "list",
                description: "List all custom commands",
                type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            },
        ],
    },
    permissionsRequired: [discord_js_1.PermissionFlagsBits.ManageGuild],
    callback: async (client, interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.guild)
            return;
        const subcommand = interaction.options.getSubcommand();
        await interaction.deferReply();
        if (subcommand === "create") {
            const command = interaction.options.getString("command", true);
            const response = interaction.options.getString("response", true);
            const existingCommand = await CustomCommand_1.default.findOne({
                guildId: interaction.guild.id,
                command,
            });
            if (existingCommand) {
                return interaction.editReply({
                    embeds: [await (0, embed_helper_1.errorEmbed)(`Command \`${command}\` already exists.`)],
                });
            }
            await CustomCommand_1.default.create({
                authorId: interaction.user.id,
                guildId: interaction.guild.id,
                command,
                response,
            });
            interaction.editReply({
                embeds: [
                    await (0, embed_helper_1.successEmbed)(interaction, `Command \`${command}\` created.`),
                ],
            });
        }
        else if (subcommand === "delete") {
            const command = interaction.options.getString("command", true);
            const existingCommand = await CustomCommand_1.default.findOne({
                guildId: interaction.guild.id,
                command,
            });
            if (!existingCommand) {
                return interaction.editReply({
                    embeds: [await (0, embed_helper_1.errorEmbed)(`Command \`${command}\` not found.`)],
                });
            }
            await CustomCommand_1.default.deleteOne({
                guildId: interaction.guild.id,
                command,
            });
            interaction.editReply({
                embeds: [
                    await (0, embed_helper_1.successEmbed)(interaction, `Command \`${command}\` deleted.`),
                ],
            });
        }
        if (subcommand === "list") {
            const commands = await CustomCommand_1.default.find({
                guildId: interaction.guild.id,
            }).select("-_id command response authorId");
            if (commands.length === 0) {
                return interaction.editReply({
                    embeds: [await (0, embed_helper_1.errorEmbed)("No custom commands found.")],
                });
            }
            const embedPages = await getCommandList(interaction, commands);
            const message = await interaction.fetchReply();
            data_1.commandMessageData.push({
                id: message.id,
                index: 0,
                pages: embedPages,
            });
            const prevButton = new discord_js_1.ButtonBuilder()
                .setCustomId("prev")
                .setLabel("Previous Page")
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setDisabled(data_1.commandMessageData[0].index === 0);
            const nextButton = new discord_js_1.ButtonBuilder()
                .setCustomId("next")
                .setLabel("Next Page")
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setDisabled(data_1.commandMessageData[0].index === embedPages.length - 1);
            interaction.editReply({
                embeds: [embedPages[0]],
                components: [
                    {
                        type: 1,
                        components: [prevButton, nextButton],
                    },
                ],
            });
        }
    },
};
const getCommandList = async (interaction, commandList) => {
    const COMMANDS_PER_PAGE = 5;
    const totalPages = Math.ceil(commandList.length / COMMANDS_PER_PAGE);
    const commandListPages = commandList.reduce((pages, command, i) => {
        if (i % COMMANDS_PER_PAGE === 0) {
            pages.push([]);
        }
        const currentPageIndex = Math.floor(i / COMMANDS_PER_PAGE);
        pages[currentPageIndex].push(command);
        return pages;
    }, []);
    const embedPages = commandListPages.map((commands, i) => {
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle("Custom Commands")
            .setColor(interaction.guild?.members.me?.displayColor || "Green")
            .setFooter({
            text: `Page ${i + 1}/${totalPages}`,
        });
        commands.forEach((command, idx) => {
            embed.addFields({
                name: `${idx === 0 ? "Command" : `\u200b`}`,
                value: command.command,
                inline: true,
            }, {
                name: `${idx === 0 ? "Response" : `\u200b`}`,
                value: command.response,
                inline: true,
            }, {
                name: `${idx === 0 ? "Author" : `\u200b`}`,
                value: `<@${command.authorId}>`,
                inline: true,
            });
        });
        return embed;
    });
    return embedPages;
};
