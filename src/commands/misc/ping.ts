import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  User,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with the bot's latency."),

  callback: async (client: Client, interaction: CommandInteraction) => {
    const embed = new EmbedBuilder();

    await interaction.deferReply();

    const reply = await interaction.fetchReply();
    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    embed.setTitle("Pong!");
    embed.setDescription("Here are the latencies:");
    embed.addFields([
      {
        name: "Client Latency",
        value: `${ping} ms`,
        inline: true,
      },
      {
        name: "Websocket Latency",
        value: `${client.ws.ping} ms`,
        inline: true,
      },
    ]);
    embed.setColor(interaction.guild?.members.me?.displayColor || "Random");

    interaction.editReply({
      embeds: [embed],
    });
  },
};
