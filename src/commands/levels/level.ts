import {
  Client,
  CommandInteraction,
  AttachmentBuilder,
  ApplicationCommandOptionType,
} from "discord.js";
import Level from "../../models/Level";
import { Font } from "canvacord";
import calculate_level_xp from "../../util/calculate_level_xp";
import { UserLevelCard } from "../../util/user_level_card";

export default {
  data: {
    name: "level",
    description: "Check your or someone else's level.",
    options: [
      {
        name: "target-user",
        description: "The user you want to check the level of.",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guild) return;

    await interaction.deferReply();

    const targetUserParam = interaction.options.getUser("target-user");
    const targetUserId = targetUserParam?.id || interaction.user.id;

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      return interaction.editReply("User not found.");
    }

    const fetchedLevel = await Level.findOne({
      userId: targetUser.id,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      return interaction.editReply(
        targetUser.id === interaction.user.id
          ? "You haven't earned any XP yet."
          : `${targetUser.user.username} hasn't earned any XP yet.`
      );
    }

    const allLevels = await Level.find({
      guildId: interaction.guild.id,
    }).select("-_id userId level xp");

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      }
      return b.level - a.level;
    });

    let currentRank =
      allLevels.findIndex((lvl) => lvl.userId === targetUser.id) + 1;

    await Font.fromFile("src/fonts/SimpleStamp.otf");

    const card = new UserLevelCard()
      .setAvatar(
        targetUser.user.displayAvatarURL({ size: 256, extension: "png" })
      )
      .setDisplayName(targetUser.user.displayName)
      .setUserStatus(targetUser.presence?.status || "offline")
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setXp(fetchedLevel.xp)
      .setXpToNextLevel(calculate_level_xp(fetchedLevel.level))
      .setXpPercentage(
        Math.floor(
          (fetchedLevel.xp / calculate_level_xp(fetchedLevel.level)) * 100
        )
      );

    const image = await card.build({ format: "png" });

    const attachment = new AttachmentBuilder(image);

    interaction.editReply({
      files: [attachment],
    });
  },
};
