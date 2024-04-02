import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} from "discord.js";
import { getLocalCommands } from "../../util/get_local_commands";

export default {
  data: {
    name: "help",
    description: "Get information about commands",
  },

  callback: async (client: Client, interaction: CommandInteraction) => {
    const commands = (await getLocalCommands()).sort((a, b) => {
      if (a.data.name < b.data.name) return -1;
      if (a.data.name > b.data.name) return 1;
      return -1;
    });

    const embed = new EmbedBuilder()
      .setTitle("Commands")
      .setDescription(
        commands
          .map((command) => {
            let permissions: string[] = [];
            Object.entries(PermissionsBitField.Flags).forEach(
              ([key, value]) => {
                command.permissionsRequired?.forEach((permission: bigint) => {
                  if (value === permission) permissions.push(key);
                });
              }
            );
            return `/**${command.data.name}** - ${command.data.description} ${
              permissions.length > 0
                ? `| **Permissions Required**: ${permissions.join(", ")}`
                : ""
            }`;
          })
          .join("\n")
      )
      .setColor(interaction.guild?.members.me?.displayColor || "Random");

    await interaction.reply({ embeds: [embed] });
  },
};
