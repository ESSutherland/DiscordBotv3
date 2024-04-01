import { Client, Message } from "discord.js";
import CustomCommand from "../../models/CustomCommand";

export default async (client: Client, message: Message) => {
  if (!message.inGuild() || message.author.bot) return;

  const customCommand = await CustomCommand.findOne({
    guildId: message.guild.id,
    command: message.content,
  });

  if (!customCommand) return;
  else {
    const response = customCommand.response.replace(
      /{user}/g,
      message.author.toString()
    );
    message.channel.send(response);
  }
};
