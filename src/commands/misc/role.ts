import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import Roles from "../../models/Roles";
import { successEmbed } from "../../util/embed_helper";

export default {
  data: {
    name: "role",
    description: "Manage server roles",
    options: [
      {
        name: "set",
        description: "Set a role",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "type",
            description: "The type of role",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              {
                name: "User",
                value: "user",
              },
              {
                name: "Live",
                value: "live",
              },
              {
                name: "Game",
                value: "game",
              },
              {
                name: "Movie",
                value: "movie",
              },
            ],
          },
          {
            name: "role",
            description: "The role to set",
            type: ApplicationCommandOptionType.Role,
            required: true,
          },
        ],
      },
    ],
  },
  requiredPermissions: [PermissionFlagsBits.Administrator],

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand() || !interaction.guild) return;
    await interaction.deferReply();

    const role = interaction.options.getRole("role", true);
    const type = interaction.options.getString("type", true);

    if (!role) return interaction.editReply("Role not found.");

    const roleData = await Roles.findOne({
      guildId: interaction.guild.id,
      type: type,
    });

    if (roleData) {
      roleData.roleId = role.id;
      return roleData.save();
    }

    Roles.create({
      guildId: interaction.guild.id,
      roleId: role.id,
      type: type,
    });

    return interaction.editReply({
      embeds: [
        await successEmbed(
          interaction,
          `Role set to ${role.toString()} for \`${type}\`.`
        ),
      ],
    });
  },
};
