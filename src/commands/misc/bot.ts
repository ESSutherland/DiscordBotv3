import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { devs } from "../../../config.json";
import { errorEmbed, successEmbed } from "../../util/embed_helper";
import { error } from "console";

export default {
  data: {
    name: "bot",
    description: "Get bot information",
  },

  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();
    const user = await client.users.fetch(devs[0]);

    if (!user)
      return interaction.editReply({
        embeds: [await errorEmbed("Error fetching bot data.")],
      });

    const embed = new EmbedBuilder()
      .setTitle(client.user?.displayName || "Bot")
      .setDescription(
        `This bot was made by ${user.toString()} in TypeScript using Discord.js v14.`
      )
      .setAuthor({
        name: user.username,
        iconURL: user.displayAvatarURL(),
      })
      .setColor(interaction.guild?.members.me?.displayColor || "Random")
      .addFields([
        {
          name: "Twitch",
          value: "https://twitch.tv/SpiderPigEthan",
        },
        {
          name: "Twitter",
          value: "https://twitter.com/SpiderPigEthan",
        },
      ]);

    return interaction.editReply({ embeds: [embed] });
  },
};
