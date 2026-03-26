import axios from "axios";
import {
  ApplicationCommandOptionType,
  Client,
  CommandInteraction,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import { errorEmbed } from "../../util/embed_helper";

export default {
  data: {
    name: "animesong",
    description: "Get an anime song (May not work 100%)",
    options: [
      {
        name: "name",
        description: "The anime to search for",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "type",
        description: "The type of song to search for (OP/ED)",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: "OP",
            value: "OP",
          },
          {
            name: "ED",
            value: "ED",
          },
        ],
      },
      {
        name: "sequence",
        description:
          "Only use if there are multiple OP/ED for the specific season",
        type: ApplicationCommandOptionType.Integer,
        required: false,
      },
    ],
  },

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    await interaction.deferReply();

    const title = interaction.options.getString("name", true);
    const type = interaction.options.getString("type", true);
    const sequence = interaction.options.getInteger("sequence");

    const animeData = await axios.get(
      `https://api.jikan.moe/v4/anime?q=${title}&limit=1&type=tv`,
    );

    if (animeData.data.data.length === 0) {
      return interaction.editReply({
        embeds: [errorEmbed("No anime found with the given parameters.")],
      });
    }

    const anime = animeData.data.data[0];

    const animeTitle =
      anime.titles.find((t: any) => t.type === "Default")?.title || anime.title;

    console.log(animeTitle);

    const searchQuery = `
query{
    animePagination(search: "%${animeTitle}%", first: 1){ 
      data { 
    name 
    animethemes(type: ${type}, first: 50){
      type
      sequence
      animethemeentries(first : 1){
        videos{
          nodes{
            link
          }
        }
      }
    }
    }
    }
  }
`;

    try {
      const resAll = await axios.post(
        "https://graphql.animethemes.moe/",
        { query: searchQuery },
        { headers: { "Content-Type": "application/json" } },
      );

      const animethemes =
        resAll.data?.data?.animePagination?.data?.[0]?.animethemes ?? [];

      if (!animethemes || animethemes.length === 0) {
        return interaction.editReply({
          embeds: [errorEmbed("No song found with the given parameters.")],
        });
      }

      let sequenceToUse: number | null = sequence ?? null;

      if (sequence == null) {
        if (animethemes.length > 1) {
          sequenceToUse = 1;
        } else {
          sequenceToUse = animethemes[0]?.sequence ?? null;
        }
      } else {
        if (
          sequence === 1 &&
          animethemes.length === 1 &&
          animethemes[0]?.sequence == null
        ) {
          sequenceToUse = null;
        } else {
          sequenceToUse = sequence;
        }
      }

      const sequenceArg =
        sequenceToUse === null ? "" : `, sequence: ${sequenceToUse}`;

      const finalQuery = `
query{
    animePagination(search: "%${animeTitle}%", first: 1){ 
      data { 
    name 
    animethemes(type: ${type}${sequenceArg}, first: 1){
      animethemeentries(first : 1){
        videos{
          nodes{
            link
          }
        }
      }
    type
    sequence
    }
    }
    }
  }
`;

      const res = await axios.post(
        "https://graphql.animethemes.moe/",
        { query: finalQuery },
        { headers: { "Content-Type": "application/json" } },
      );

      const songVideo =
        res.data?.data?.animePagination?.data?.[0]?.animethemes?.[0]
          ?.animethemeentries?.[0]?.videos?.nodes?.[0]?.link ?? null;

      if (!songVideo) {
        return interaction.editReply({
          embeds: [errorEmbed("No song found with the given parameters.")],
        });
      }

      console.log(`Fetching video from ${songVideo}...`);

      const videoResp = await axios.get(songVideo, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(videoResp.data);
      const fileName = songVideo.split("/").pop() || "song.webm";

      console.log(
        `Fetched video of size ${Math.round(buffer.length / 1024 / 1024)}MB from ${songVideo}`,
      );

      const MAX_UPLOAD = 50 * 1024 * 1024;
      if (buffer.length > MAX_UPLOAD) {
        return interaction.editReply({
          content: `Video is too large to upload (${Math.round(buffer.length / 1024 / 1024)}MB). Here's the link: ${songVideo}`,
        });
      }

      const attachment = new AttachmentBuilder(buffer, { name: fileName });
      const displaySequence = sequenceToUse === null ? 1 : sequenceToUse;
      await interaction.editReply({
        content: `${res.data.data.animePagination.data[0].name} - ${type} ${displaySequence}`,
        files: [attachment],
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        embeds: [errorEmbed("Failed to fetch or send the song video.")],
      });
    }
  },
};
