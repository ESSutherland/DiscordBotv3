import axios from "axios";
import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  GuildEmoji,
  PermissionFlagsBits,
} from "discord.js";
import sharp from "sharp";
import { errorEmbed, successEmbed } from "../../util/embed_helper";

export default {
  data: {
    name: "7tv",
    description: "Add a 7tv emote to the server.",
    options: [
      {
        name: "emote_id",
        description: "The id of the 7TV emote to add.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "name",
        description: "The name of the emote.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "animated",
        description: "Whether the emote is animated or not.",
        type: ApplicationCommandOptionType.Boolean,
        required: true,
      },
    ],
  },

  permissionsRequired: [PermissionFlagsBits.ManageGuildExpressions],
  botPermissions: [PermissionFlagsBits.ManageGuildExpressions],

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (
      !interaction.isChatInputCommand() ||
      !interaction.inGuild() ||
      !interaction.guild
    )
      return;

    await interaction.deferReply();

    const emoteId = interaction.options.getString("emote_id", true);
    const name = interaction.options.getString("name", true);
    const animated = interaction.options.getBoolean("animated") || false;

    let emoteImage;

    try {
      const image = await axios.get(
        `https://cdn.7tv.app/emote/${emoteId}/4x.webp`,
        { responseType: "arraybuffer" }
      );
      emoteImage = image;
    } catch (error) {
      return await interaction.editReply({
        embeds: [errorEmbed("Failed to fetch the 7TV emote.")],
      });
    }

    let emoteData = await uploadEmote(
      interaction,
      emoteImage.data,
      name,
      animated,
      animated ? [96, 96] : [128, 128]
    );

    if (!emoteData) {
      return await interaction.editReply({
        embeds: [errorEmbed("Failed to add the 7TV emote.")],
      });
    }

    await interaction.editReply({
      embeds: [
        successEmbed(
          interaction,
          `Emote \`${name}\` added successfully. ${emoteData}`
        ),
      ],
    });
  },
};

const uploadEmote = async (
  interaction: CommandInteraction,
  image: Buffer,
  name: string,
  animated: boolean,
  size: [number, number]
): Promise<GuildEmoji | undefined> => {
  let emoteData: GuildEmoji | undefined;

  const buffer = await sharp(image, { animated })
    .toFormat(animated ? "gif" : "png", {
      quality: 100,
      compressionLevel: 9,
      colours: 128,
      dither: 0.4,
    })
    .resize(...size, {
      fit: "inside",
      withoutEnlargement: true,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  try {
    emoteData = await interaction.guild?.emojis.create({
      name,
      attachment: buffer,
    });
  } catch (error) {
    if (size[0] > 32) {
      return await uploadEmote(interaction, image, name, animated, [
        Math.floor(size[0] * 0.8),
        Math.floor(size[1] * 0.8),
      ]);
    }
  }

  return emoteData;
};
