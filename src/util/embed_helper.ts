import { Client, CommandInteraction, EmbedBuilder, User } from "discord.js";

export const successEmbed = (
  interaction: CommandInteraction,
  description: string,
  footer?: string,
  author?: User
) => {
  const embed = new EmbedBuilder()
    .setColor(interaction.guild?.members.me?.displayColor || "Green")
    .setTitle("Success!")
    .setDescription(description);

  if (footer)
    embed.setFooter({
      text: footer,
    });

  return embed;
};

export const errorEmbed = (description: string) => {
  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle("Failed!")
    .setDescription(description);

  return embed;
};
