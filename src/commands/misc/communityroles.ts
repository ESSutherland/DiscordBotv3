import {
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";

export default {
  data: {
    name: "communityroles",
    description: "Create comminity roles message",
  },

  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guild || !interaction.inGuild() || !interaction.member)
      return;
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.channel || !interaction.guild) return;

    const liveButton = new ButtonBuilder()
      .setLabel("Live Notifications")
      .setCustomId("live")
      .setEmoji("🔴")
      .setStyle(ButtonStyle.Secondary);

    const movieButton = new ButtonBuilder()
      .setLabel("Watch Parties")
      .setCustomId("movie")
      .setEmoji("🎥")
      .setStyle(ButtonStyle.Secondary);

    const gameButton = new ButtonBuilder()
      .setLabel("Community Games")
      .setCustomId("game")
      .setEmoji("🎮")
      .setStyle(ButtonStyle.Secondary);

    const embed = new EmbedBuilder()
      .setTitle("Community Roles")
      .setColor(interaction.guild.members.me?.displayColor || "Random")
      .setDescription(
        "Click the buttons below to add a community role to yourself so you can be notified of community events. You can remove the role by clicking the button again."
      );

    const message = await interaction.channel.send({
      embeds: [embed],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [liveButton, movieButton, gameButton],
        },
      ],
    });

    interaction.editReply("Done!");
  },
};
