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
    description: "Get an anime song",
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

    const title = interaction.options.getString("params", true);
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

    const query = `
query{
    animePagination(search: "%${animeTitle}%", first: 1){ 
      data { 
	  name 
	  animethemes(type: ${type}, sequence: ${sequence}, first: 1){
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

    try {
      const res = await axios.post(
        "https://graphql.animethemes.moe/",
        { query },
        { headers: { "Content-Type": "application/json" } },
      );

      let songVideo =
        res.data?.data?.animePagination?.data?.[0]?.animethemes?.[0]
          ?.animethemeentries?.[0]?.videos?.nodes?.[0]?.link ?? null;

      if (!songVideo) {
        songVideo;

        return interaction.editReply({
          embeds: [errorEmbed("No song found with the given parameters.")],
        });
      }

      const videoResp = await axios.get(songVideo, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(videoResp.data);
      const fileName = songVideo.split("/").pop() || "song.webm";

      const MAX_UPLOAD = 60 * 1024 * 1024;
      if (buffer.length > MAX_UPLOAD) {
        return interaction.editReply({
          content: `Video is too large to upload (${Math.round(buffer.length / 1024 / 1024)}MB). Here's the link: ${songVideo}`,
        });
      }

      const attachment = new AttachmentBuilder(buffer, { name: fileName });
      await interaction.editReply({
        content: `${res.data.data.animePagination.data[0].name} - ${type} ${sequence || 1}`,
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
