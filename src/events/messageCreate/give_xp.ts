import { ChannelType, Client, EmbedBuilder, Message } from "discord.js";
import Level from "../../models/Level";
import calculate_level_xp from "../../util/calculate_level_xp";
import Channels from "../../models/Channels";

const cooldowns = new Set();

const getRandomXp = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default async (client: Client, message: Message) => {
  if (!message.guild || message.author.bot || cooldowns.has(message.author.id))
    return;

  let xpToGive = getRandomXp(10, 25);

  const member = await message.guild.members.fetch(message.author.id);

  if (member.premiumSince) {
    xpToGive = xpToGive * 2;
  }

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };
  try {
    const level = await Level.findOne(query);

    if (level) {
      level.xp += xpToGive;

      if (level.xp >= calculate_level_xp(level.level)) {
        level.xp = level.xp - calculate_level_xp(level.level);
        level.level += 1;

        const channelId = await Channels.findOne({
          guildId: message.guild.id,
          type: "bot",
        }).select("-_id channelId");

        if (channelId) {
          const channel = message.guild.channels.cache.get(channelId.channelId);

          if (channel && channel.type === ChannelType.GuildText) {
            const embed = new EmbedBuilder()
              .setAuthor({
                name: `${message.author.displayName} leveled up!`,
                iconURL: message.author.displayAvatarURL(),
              })
              .setColor(message.guild.members.me?.displayColor || "Random")
              .setDescription(
                `Congrats ${message.author}, you've leveled up to level **${
                  level.level
                }**! ${level.level === 69 ? "Nice." : ""}`
              );

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
    } else {
      const newLevel = new Level({
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
  } catch (error) {
    console.error(error);
  }
};
