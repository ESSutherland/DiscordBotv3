import { MojangClient } from "@tecc/mojang.js";
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

    const mojang = new MojangClient();

    await interaction.deferReply();

    const username = interaction.options.getString("username", true);

    Rcon.connect({
      host: process.env.RCON_IP!,
      password: process.env.RCON_PASSWORD!,
      port: Number(process.env.RCON_PORT!),
    })
      .then(async (rcon) => {
        try {
          const user = await mojang.getUuid(username);

          const mcData = await MinecraftUsers.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild?.id,
          });

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
              minecraftUsername: user.name,
            },
            { upsert: true }
          );
          await rcon.send(`whitelist add ${user.name}`);
          rcon.end();

          interaction.editReply({
            embeds: [
              successEmbed(
                interaction,
                `Minecraft username \`${username}\` added to the whitelist.`
              ),
            ],
          });
        } catch (error) {
          console.log(error);
          interaction.editReply({
            embeds: [
              errorEmbed(`Minecraft username \`${username}\` not found.`),
            ],
          });
        }
      })
      .catch((error) => {
        interaction.editReply({
          embeds: [errorEmbed(`Failed to connect to RCON.`)],
        });
      });
  },
};
