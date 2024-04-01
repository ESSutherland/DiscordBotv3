import { Client, Message } from "discord.js";
import Level from "../../models/Level";
import calculate_level_xp from "../../util/calculate_level_xp";

const cooldowns = new Set();

const getRandomXp = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default async (client: Client, message: Message) => {
  if (
    !message.inGuild() ||
    message.author.bot ||
    cooldowns.has(message.author.id)
  )
    return;

  const xpToGive = getRandomXp(5, 15);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    const level = await Level.findOne(query);

    if (level) {
      level.xp += xpToGive;

      if (level.xp >= calculate_level_xp(level.level)) {
        level.xp = 0;
        level.level += 1;

        message.channel.send(
          `Congrats ${message.author}, you've leveled up to level ${level.level}!`
        );
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
