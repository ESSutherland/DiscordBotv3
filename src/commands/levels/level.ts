import {
  Client,
  CommandInteraction,
  SlashCommandBuilder,
  AttachmentBuilder,
} from "discord.js";
import Level from "../../models/Level";
import { Font, RankCardBuilder } from "canvacord";
import calculate_level_xp from "../../util/calculate_level_xp";
import { UserCard } from "../../util/user_card";

export default {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Check your or someone else's level.")
    .addUserOption((option) =>
      option
        .setName("target-user")
        .setDescription("The user you want to check the level of.")
    ),

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
  },
};
