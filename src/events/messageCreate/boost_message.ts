import { ActivityType, Client, Message, MessageType } from "discord.js";

export default async (client: Client, message: Message) => {
  if (message.author.bot) return;

  const boostTypes = [
    MessageType.GuildBoost,
    MessageType.GuildBoostTier1,
    MessageType.GuildBoostTier2,
    MessageType.GuildBoostTier3,
  ];

  if (!boostTypes.find((type) => type === message.type)) return;

  const guild = message.guild;

  if (!guild) return;

  const channel = message.guild.channels.cache.get("712439399274774588");

  if (!channel || !channel.isTextBased()) return;

  channel.send(
    `🎉 **Thank you ${message.author.toString()} for boosting the server!** 🎉`
  );
};
