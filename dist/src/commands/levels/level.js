"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Level_1 = require("../../models/Level");
const canvacord_1 = require("canvacord");
const calculate_level_xp_1 = require("../../util/calculate_level_xp");
const user_level_card_1 = require("../../util/user_level_card");
const embed_helper_1 = require("../../util/embed_helper");
exports.default = {
    data: {
        name: "level",
        description: "Check your or someone else's level.",
        options: [
            {
                name: "target-user",
                description: "The user you want to check the level of.",
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
        const fetchedLevel = await Level_1.default.findOne({
            userId: targetUser.id,
            guildId: interaction.guild.id,
        });
        if (!fetchedLevel) {
            return interaction.editReply({
                embeds: [
                    (0, embed_helper_1.errorEmbed)(targetUser.id === interaction.user.id
                        ? "You haven't earned any XP yet."
                        : `${targetUser.user.username} hasn't earned any XP yet.`),
                ],
            });
        }
        const allLevels = await Level_1.default.find({
            guildId: interaction.guild.id,
        }).select("-_id userId level xp");
        allLevels.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            }
            return b.level - a.level;
        });
        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUser.id) + 1;
        await canvacord_1.Font.fromFile("src/fonts/SimpleStamp.otf");
        const card = new user_level_card_1.UserLevelCard()
            .setAvatar(targetUser.user.displayAvatarURL({ size: 256, extension: "png" }))
            .setDisplayName(targetUser.user.displayName)
            .setUserStatus(targetUser.presence?.status || "offline")
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setXp(fetchedLevel.xp)
            .setXpToNextLevel((0, calculate_level_xp_1.default)(fetchedLevel.level))
            .setXpPercentage(Math.floor((fetchedLevel.xp / (0, calculate_level_xp_1.default)(fetchedLevel.level)) * 100));
        const image = await card.build({ format: "png" });
        const attachment = new discord_js_1.AttachmentBuilder(image);
        interaction.editReply({
            files: [attachment],
        });
    },
};
