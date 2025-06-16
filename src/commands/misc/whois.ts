import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  Role,
} from "discord.js";
import Roles from "../../models/Roles";

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
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply();

    const user = interaction.options.getUser("user") || interaction.user;
    const guild = interaction.guild;

    console.log(guild);
    if (!guild) return;

    const member = guild.members.cache.get(user.id);

    console.log(member);
    if (!member) return;

    // const roleId = await Roles.findOne({ guildId: guild.id, type: "user" });

    // console.log(roleId);
    // if (!roleId) return;

    // const defaultRole = guild.roles.cache.get(roleId.roleId);

    // console.log(defaultRole);
    // if (!defaultRole) return;

    const specialPermissions = member.permissions.toArray().filter((perm) => {
      return !guild.roles.everyone.permissions.toArray().includes(perm);
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
