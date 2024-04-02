import { Font } from "canvacord";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  Client,
  CommandInteraction,
} from "discord.js";
import { UserCard } from "../../util/user_card";

export default {
  data: {
    name: "user",
    description: "Check your or someone else's user card.",
    options: [
      {
        name: "target-user",
        description: "The user you want to check the card of.",
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

    await Font.fromFile("src/fonts/SimpleStamp.otf");

    const roles = targetUser.roles.cache
      .filter((role) => role.name !== "@everyone")
      .map((role) => role)
      .sort((a, b) => b.position - a.position);

    console.log(
      targetUser.user.displayAvatarURL({
        size: 256,
        extension: "png",
        forceStatic: true,
      })
    );

    const card = new UserCard()
      .setAvatar(
        targetUser.user.displayAvatarURL({
          size: 256,
          extension: "png",
          forceStatic: true,
        })
      )
      .setDisplayName(targetUser.user.displayName)
      .setUserName(targetUser.user.username)
      .setGuildName(interaction.guild.name)
      .setGuildIcon(
        interaction.guild.iconURL({ size: 256, extension: "png" }) || ""
      )
      .setJoinedAt(targetUser.joinedAt?.toDateString() as string)
      .setRegisteredAt(targetUser.user.createdAt.toDateString())
      .setRoles(roles)
      .setDisplayHexColor(targetUser.displayHexColor)
      .setUserStatus(targetUser.presence?.status || "offline");
    const image = await card.build({ format: "png" });

    const attachment = new AttachmentBuilder(image);

    interaction.editReply({
      files: [attachment],
    });
  },
};
