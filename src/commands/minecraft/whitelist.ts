import { Rcon } from "rcon-client";
import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
} from "discord.js";
import { errorEmbed, successEmbed } from "../../util/embed_helper";
import MinecraftUsers from "../../models/MinecraftUsers";

export default {
  data: {
    name: "whitelist",
    description: "Add yourself to the minecraft whitelist",
    options: [
      {
        name: "username",
        type: ApplicationCommandOptionType.String,
        description: "Your Minecraft username",
        required: true,
      },
    ],
  },

  subOnly: true,

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand() || !interaction.guild) return;

    await interaction.deferReply();

    const username = interaction.options.getString("username", true);

    Rcon.connect({
      host: process.env.RCON_IP!,
      password: process.env.RCON_PASSWORD!,
      port: Number(process.env.RCON_PORT!),
    })
      .then(async (rcon) => {
        try {
          const mcData = await MinecraftUsers.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild?.id,
          });

          const response = await rcon.send(`whitelist add ${username}`);
          console.log(response);

          if (response.includes("does not exist")) {
            rcon.end();
            return interaction.editReply({
              embeds: [
                errorEmbed(`Minecraft username \`${username}\` not found.`),
              ],
            });
          }

          if (mcData) {
            await rcon.send(`whitelist remove ${mcData.minecraftUsername}`);
          }

          await MinecraftUsers.findOneAndUpdate(
            {
              userId: interaction.user.id,
              guildId: interaction.guild?.id,
            },
            {
              userId: interaction.user.id,
              guildId: interaction.guild?.id,
              minecraftUsername: username,
            },
            { upsert: true }
          );

          rcon.end();

          interaction.editReply({
            embeds: [
              successEmbed(
                interaction,
                `Minecraft username \`${username}\` added to the whitelist.`
              ),
            ],
          });
        } catch (error: any) {
          if (error.response.status === 404) {
            interaction.editReply({
              embeds: [
                errorEmbed(`Minecraft username \`${username}\` not found.`),
              ],
            });
          } else {
            interaction.editReply({
              embeds: [errorEmbed(`An API error occured. Please try again.`)],
            });
          }
          rcon.end();
        }
      })
      .catch((error) => {
        interaction.editReply({
          embeds: [errorEmbed(`Failed to connect to RCON.`)],
        });
      });
  },
};
