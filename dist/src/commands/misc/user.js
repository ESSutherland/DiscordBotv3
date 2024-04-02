"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const canvacord_1 = require("canvacord");
const discord_js_1 = require("discord.js");
const user_card_1 = require("../../util/user_card");
exports.default = {
    data: {
        name: "user",
        description: "Check your or someone else's user card.",
        options: [
            {
                name: "target-user",
                description: "The user you want to check the card of.",
                type: discord_js_1.ApplicationCommandOptionType.User,
                required: false,
            },
        ],
    },
    callback: async (client, interaction) => {
        if (!interaction.guild)
            return;
        await interaction.deferReply();
        const targetUserParam = interaction.options.getUser("target-user");
        const targetUserId = targetUserParam?.id || interaction.user.id;
        const targetUser = await interaction.guild.members.fetch(targetUserId);
        if (!targetUser) {
            return interaction.editReply("User not found.");
        }
        await canvacord_1.Font.fromFile("src/fonts/SimpleStamp.otf");
        const roles = targetUser.roles.cache
            .filter((role) => role.name !== "@everyone")
            .map((role) => role)
            .sort((a, b) => b.position - a.position);
        const card = new user_card_1.UserCard()
            .setAvatar(targetUser.user.displayAvatarURL({ size: 256, extension: "png" }))
            .setDisplayName(targetUser.user.displayName)
            .setUserName(targetUser.user.username)
            .setGuildName(interaction.guild.name)
            .setGuildIcon(interaction.guild.iconURL({ size: 256, extension: "png" }) || "")
            .setJoinedAt(targetUser.joinedAt?.toDateString())
            .setRegisteredAt(targetUser.user.createdAt.toDateString())
            .setRoles(roles)
            .setDisplayHexColor(targetUser.displayHexColor)
            .setUserStatus(targetUser.presence?.status || "offline");
        const image = await card.build({ format: "png" });
        const attachment = new discord_js_1.AttachmentBuilder(image);
        interaction.editReply({
            files: [attachment],
        });
    },
};
