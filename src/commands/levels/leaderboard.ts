import { AttachmentBuilder, Client, CommandInteraction } from "discord.js";
import Level from "../../models/Level";
import { Leaderboard } from "../../util/leaderboard";
import { Font } from "canvacord";

export default {
  data: {
    name: "leaderboard",
    description: "Shows the leaderboard",
  },

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guild) return;

    await interaction.deferReply();

    const allLevels = await Level.find({
      guildId: interaction.guild.id,
    }).select("-_id userId level xp");

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      }
      return b.level - a.level;
    });

    let users = [];

    for (let i = 0; i < Math.min(allLevels.length, 5); i++) {
      const user = await interaction.guild.members.fetch(allLevels[i].userId);
      users.push(user);
    }

    await Font.fromFile("src/fonts/SimpleStamp.otf");

    const leaderboard = new Leaderboard().setUsers(users).setLevels(allLevels);

    const image = await leaderboard.build({ format: "png" });
    const attachment = new AttachmentBuilder(image);

    interaction.editReply({
      files: [attachment],
    });
  },
};
