import { Client, CommandInteraction, EmbedBuilder } from "discord.js";

export default {
  data: {
    name: "help",
    description: "Get information about commands",
  },

  callback: async (client: Client, interaction: CommandInteraction) => {
    interaction.reply("NOT IMPLEMENTED YET!");
  },
};
