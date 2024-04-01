import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";

export default {
  data: {
    name: "whois",
    description: "Get information about a user",
    options: [
      {
        name: "user",
        description: "The user to get information about",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },

  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const user = interaction.options.getUser("user") || interaction.user;
    const guild = interaction.guild;

    if (!guild) return;

    const member = guild.members.cache.get(user.id);

    if (!member) return;

    const defaultRole = guild.roles.cache.get("674036927942361118");

    if (!defaultRole) return;

    const specialPermissions = member.permissions.toArray().filter((perm) => {
      return !defaultRole.permissions.toArray().includes(perm);
    });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL(),
      })
      .setDescription(member.user.toString())
      .setThumbnail(member.user.displayAvatarURL())
      .addFields([
        {
          name: "Registered",
          value:
            `${member.user.createdAt.toDateString()} \n ${member.user.createdAt.toLocaleTimeString()}` ||
            "Unknown",
          inline: true,
        },
        {
          name: "Joined",
          value:
            `${member.joinedAt?.toDateString()} \n ${member.joinedAt?.toLocaleTimeString()}` ||
            "Unknown",
          inline: true,
        },
        {
          name: `Roles [${member.roles.cache.size - 1}]`,
          value: member.roles.cache
            .filter((role) => role.name !== "@everyone")
            .map((role) => role)
            .sort((a, b) => b.position - a.position)
            .join(", "),
        },
      ])
      .addFields(
        specialPermissions.length > 0
          ? [
              {
                name: "Special Permissions",
                value: specialPermissions.join(", "),
              },
            ]
          : []
      )
      .setColor(member.displayColor || "Blue")
      .setFooter({
        text: `ID: ${member.id}`,
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
