"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const embed_helper_1 = require("../../util/embed_helper");
const role_color_1 = require("../../util/role_color");
exports.default = {
    data: {
        name: "color",
        nameLocalizations: {
            "en-GB": "colour",
        },
        description: "Create or edit a colored role.",
        descriptionLocalizations: {
            "en-GB": "Create or edit a coloured role.",
        },
        options: [
            {
                name: "color",
                nameLocalizations: {
                    "en-GB": "colour",
                },
                description: "The HEX value of the color you want to use.",
                descriptionLocalizations: {
                    "en-GB": "The HEX value of the colour you want to use.",
                },
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    botPermissions: [discord_js_1.PermissionFlagsBits.ManageRoles],
    nitroOnly: true,
    callback: async (client, interaction) => {
        if (!interaction.isChatInputCommand() || !interaction.inGuild())
            return;
        await interaction.deferReply();
        const color = interaction.options.getString("color", true);
        const regex = "^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
        if (!color.match(regex)) {
            return interaction.editReply({
                embeds: [
                    (0, embed_helper_1.errorEmbed)('Invalid color format. Please use a HEX value like "#FF0000" or "FF0000".'),
                ],
            });
        }
        const colorHex = color.toUpperCase().replace("#", "");
        const colorImg = await new role_color_1.RoleColor()
            .setColor(colorHex)
            .build({ format: "png" });
        const imgAttachment = new discord_js_1.AttachmentBuilder(colorImg).setName("color.png");
        const guild = interaction.guild;
        if (!guild) {
            return interaction.editReply({
                embeds: [(0, embed_helper_1.errorEmbed)("This command can only be used in a server.")],
            });
        }
        const user = interaction.user;
        const member = guild.members.cache.get(user.id);
        if (!member) {
            return interaction.editReply({
                embeds: [(0, embed_helper_1.errorEmbed)("Failed to get member.")],
            });
        }
        const bot = guild.members.me;
        if (!bot) {
            return interaction.editReply({
                embeds: [(0, embed_helper_1.errorEmbed)("Failed to get bot.")],
            });
        }
        const role = guild.roles.cache.find((role) => role.name === user.username);
        if (!role) {
            const createdRole = await guild?.roles.create({
                name: user.username,
                color: colorHex,
            });
            if (!createdRole) {
                return interaction.editReply({
                    embeds: [(0, embed_helper_1.errorEmbed)("Failed to create role.")],
                });
            }
            member.roles.add(createdRole);
            const rolePos = Math.min(bot.roles.highest.position - 1 || 0, member.roles.highest.position || 0);
            createdRole.setPosition(rolePos);
            interaction.editReply({
                files: [imgAttachment],
                embeds: [
                    await colorEmbed(colorHex, `Color set to \`#${colorHex}\` for ${user.toString()}`),
                ],
            });
            return;
        }
        const rolePos = Math.min(bot.roles.highest.position - 1 || 0, member.roles.highest.position || 0);
        if (rolePos !== role.position)
            role.setPosition(rolePos);
        guild.roles.cache.get(role.id)?.setColor(colorHex);
        interaction.editReply({
            files: [imgAttachment],
            embeds: [
                await colorEmbed(colorHex, `Color set to \`#${colorHex}\` for ${user.toString()}`),
            ],
        });
        return;
    },
};
const colorEmbed = async (color, description) => {
    const embed = new discord_js_1.EmbedBuilder()
        .setColor(color)
        .setTitle("Success!")
        .setDescription(description)
        .setThumbnail(`attachment://color.png`);
    return embed;
};
