import {
  AttachmentBuilder,
  Client,
  CommandInteraction,
  EmbedBuilder,
  HexColorString,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

import * as PImage from "pureimage";
import * as fs from "fs";

import hexToRgba = require("hex-to-rgba");

import { errorEmbed } from "../../util/embed_helper";

export default {
  data: new SlashCommandBuilder()
    .setName("color")
    .setNameLocalizations({
      "en-GB": "colour",
    })
    .setDescription("Create or edit a colored role.")
    .setDescriptionLocalizations({
      "en-GB": "Create or edit a coloured role.",
    })
    .addStringOption((option) =>
      option
        .setName("color")
        .setNameLocalizations({ "en-GB": "colour" })
        .setDescription("The HEX value of the color you want to use.")
        .setDescriptionLocalizations({
          "en-GB": "The HEX value of the colour you want to use.",
        })
        .setRequired(true)
    ),

  botPermissions: [PermissionFlagsBits.ManageRoles],

  nitroOnly: true,

  callback: async (client: Client, interaction: CommandInteraction) => {
    await interaction.deferReply();

    const color = interaction.options.get("color")?.value as string;
    const regex = "^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";

    if (!color.match(regex)) {
      return interaction.editReply({
        embeds: [
          errorEmbed(
            'Invalid color format. Please use a HEX value like "#FF0000" or "FF0000".'
          ),
        ],
      });
    }

    const colorHex = color.toUpperCase().replace("#", "") as HexColorString;

    const colorImg = PImage.make(100, 100);
    const ctx = colorImg.getContext("2d");
    const rgbaColor = hexToRgba(color, 1);

    ctx.fillStyle = rgbaColor;
    ctx.fillRect(0, 0, 100, 100);

    await PImage.encodePNGToStream(
      colorImg,
      fs.createWriteStream("src/images/color.png")
    );

    const imgAttachment = new AttachmentBuilder("src/images/color.png").setName(
      "color.png"
    );

    const guild = interaction.guild;

    if (!guild) {
      return interaction.editReply({
        embeds: [errorEmbed("This command can only be used in a server.")],
      });
    }

    const user = interaction.user;
    const member = guild.members.cache.get(user.id);

    if (!member) {
      return interaction.editReply({
        embeds: [errorEmbed("Failed to get member.")],
      });
    }

    const bot = guild.members.me;

    if (!bot) {
      return interaction.editReply({
        embeds: [errorEmbed("Failed to get bot.")],
      });
    }

    const role = guild.roles.cache.find((role) => role.name === user.username);

    if (!role) {
      const createdRole = await guild?.roles.create({
        name: user.username,
        color: colorHex,
      });

      if (!createdRole) {
        return interaction.editReply({
          embeds: [errorEmbed("Failed to create role.")],
        });
      }

      member.roles.add(createdRole);

      const rolePos = Math.min(
        (bot.roles.highest.position as number) - 1 || 0,
        member.roles.highest.position || 0
      );

      createdRole.setPosition(rolePos);

      interaction.editReply({
        files: [imgAttachment],
        embeds: [
          await colorEmbed(
            colorHex,
            `Color set to ${"`#" + colorHex + "`"} for ${user.toString()}`
          ),
        ],
      });
      return;
    }

    const rolePos = Math.min(
      (bot.roles.highest.position as number) - 1 || 0,
      member.roles.highest.position || 0
    );

    if (rolePos !== role.position) role.setPosition(rolePos);

    guild.roles.cache.get(role.id)?.setColor(colorHex);

    interaction.editReply({
      files: [imgAttachment],
      embeds: [
        await colorEmbed(
          colorHex,
          `Color set to ${"`#" + colorHex + "`"} for ${user.toString()}`
        ),
      ],
    });
    return;
  },
};

const colorEmbed = async (color: HexColorString, description: string) => {
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle("Success!")
    .setDescription(description)
    .setThumbnail(`attachment://color.png`);

  return embed;
};
