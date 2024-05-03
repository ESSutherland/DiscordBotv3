import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import Roles from "../../models/Roles";
import { errorEmbed, successEmbed } from "../../util/embed_helper";

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
              {
                name: "Sub",
                value: "sub",
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
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand() || !interaction.guild) return;
    await interaction.deferReply();

    const role = interaction.options.getRole("role", true);
    const type = interaction.options.getString("type", true);

    if (!role)
      return interaction.editReply({
        embeds: [errorEmbed("Role not found.")],
      });

    await Roles.findOneAndUpdate(
      {
        guildId: interaction.guild.id,
        type: type,
      },
      {
        guildId: interaction.guild.id,
        roleId: role.id,
        type: type,
      },
      {
        upsert: true,
      }
    );

    return interaction.editReply({
      embeds: [
        successEmbed(
          interaction,
          `Role set to ${role.toString()} for \`${type}\`.`
        ),
      ],
    });
  },
};
