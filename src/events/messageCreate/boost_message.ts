import { ActivityType, Client, Message, MessageType } from "discord.js";
import Channels from "../../models/Channels";
import BoostMessage from "../../models/BoostMessage";
import { devs } from "../../../config.json";

export default async (client: Client, message: Message) => {
  if (message.author.bot) return;

  const boostTypes = [
    MessageType.GuildBoost,
    MessageType.GuildBoostTier1,
    MessageType.GuildBoostTier2,
    MessageType.GuildBoostTier3,
  ];

  if (
    !boostTypes.find((type) => type === message.type) &&
    devs.find((id) => id !== message.author.id)
  )
    return;

  if (
    devs.find((id) => id === message.author.id) &&
    message.content !== "boost_test"
  )
    return;

  const guild = message.guild;

  if (!guild) return;

  const channelId = await Channels.findOne({
    guildId: guild.id,
    type: "general",
  });

  if (!channelId) return;

  const channel = message.guild.channels.cache.get(channelId.channelId);

  if (!channel || !channel.isTextBased()) return;

  const existingMessage = await BoostMessage.findOne({
    guildId: guild.id,
  });

  if (!existingMessage) return;

  const boostMessage = existingMessage.message.replace(
    "{user}",
    message.author.toString()
  );

  channel.send(boostMessage);
};
