import {
  ButtonBuilder,
  ButtonStyle,
  Client,
  ComponentType,
  Interaction,
} from "discord.js";
import { commandMessageData } from "../../util/data";

export default async (client: Client, interaction: Interaction) => {
  if (!interaction.isButton()) return;

  const commandData = commandMessageData.find(
    (data) => data.id === interaction.message.id
  );
  if (!commandData) return;

  if (interaction.customId === "prev") {
    interaction.deferUpdate();
    if (commandData.index === 0) return;
    commandData.index--;
  }

  if (interaction.customId === "next") {
    interaction.deferUpdate();
    if (commandData.index === commandData.pages.length - 1) return;
    commandData.index++;
  }

  const prevButton = new ButtonBuilder()
    .setCustomId("prev")
    .setLabel("Previous Form")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(commandData.index === 0);

  const nextButton = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("Next Form")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(commandData.index === commandData.pages.length - 1);

  interaction.message.edit({
    embeds: [commandData.pages[commandData.index]],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [prevButton, nextButton],
      },
    ],
  });
};
