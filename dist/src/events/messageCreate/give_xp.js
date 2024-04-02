"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Level_1 = require("../../models/Level");
const calculate_level_xp_1 = require("../../util/calculate_level_xp");
const Channels_1 = require("../../models/Channels");
const cooldowns = new Set();
const getRandomXp = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.default = async (client, message) => {
    if (!message.guild || message.author.bot || cooldowns.has(message.author.id))
        return;
    const xpToGive = getRandomXp(10, 25);
    console.log(xpToGive);
    const query = {
        userId: message.author.id,
        guildId: message.guild.id,
    };
    try {
        const level = await Level_1.default.findOne(query);
        if (level) {
            level.xp += xpToGive;
            if (level.xp >= (0, calculate_level_xp_1.default)(level.level)) {
                level.xp = level.xp - (0, calculate_level_xp_1.default)(level.level);
                level.level += 1;
                const channelId = await Channels_1.default.findOne({
                    guildId: message.guild.id,
                    type: "bot",
                }).select("-_id channelId");
                if (channelId) {
                    const channel = message.guild.channels.cache.get(channelId.channelId);
                    if (channel && channel.type === discord_js_1.ChannelType.GuildText) {
                        const embed = new discord_js_1.EmbedBuilder()
                            .setAuthor({
                            name: `${message.author.displayName} leveled up!`,
                            iconURL: message.author.displayAvatarURL(),
                        })
                            .setColor(message.guild.members.me?.displayColor || "Random")
                            .setDescription(`Congrats ${message.author}, you've leveled up to level **${level.level}**! ${level.level === 69 ? "Nice." : ""}`);
                        channel.send({
                            embeds: [embed],
                        });
                    }
                }
            }
            await level.save().catch((e) => {
                console.error(e);
                return;
            });
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);
        }
        else {
            const newLevel = new Level_1.default({
                userId: message.author.id,
                guildId: message.guild.id,
                xp: xpToGive,
            });
            await newLevel.save().catch((e) => {
                console.error(e);
                return;
            });
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);
        }
    }
    catch (error) {
        console.error(error);
    }
};
