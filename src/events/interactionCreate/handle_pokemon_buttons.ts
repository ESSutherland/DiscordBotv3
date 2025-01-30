import {
  ButtonBuilder,
  ButtonStyle,
  Client,
  ComponentType,
  Interaction,
} from "discord.js";
import { pokemonMessageData } from "../../util/data";

export default async (client: Client, interaction: Interaction) => {
  if (!interaction.isButton()) return;

  const pokemonData = pokemonMessageData.find(
    (data) => data.id === interaction.message.id
  );
  if (!pokemonData) return;

  if (interaction.customId === "prev") {
    interaction.deferUpdate();
    if (pokemonData.index === 0) return;
    pokemonData.index--;
    pokemonData.isShiny = false;
  }

  if (interaction.customId === "shiny") {
    interaction.deferUpdate();
    pokemonData.isShiny = !pokemonData.isShiny;
  }

  if (interaction.customId === "next") {
    interaction.deferUpdate();
    if (pokemonData.index === pokemonData.pages.length - 1) return;
    pokemonData.index++;
    pokemonData.isShiny = false;
  }

  const prevButton = new ButtonBuilder()
    .setCustomId("prev")
    .setLabel("Previous Form")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(pokemonData.index === 0);

  const shinyButton = new ButtonBuilder()
    .setCustomId("shiny")
    .setLabel("Shiny")
    .setEmoji("✨")
    .setStyle(ButtonStyle.Primary);

  const nextButton = new ButtonBuilder()
    .setCustomId("next")
    .setLabel("Next Form")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(pokemonData.index === pokemonData.pages.length - 1);

  interaction.message.edit({
    embeds: [
      pokemonData.pages[pokemonData.index]
        .setImage(
          pokemonData.isShiny
            ? pokemonData.pokemonData[pokemonData.index].sprites.other?.home
                .front_shiny || ""
            : pokemonData.pokemonData[pokemonData.index].sprites.other?.home
                .front_default || ""
        )
        .setFooter({
          text: pokemonData.isShiny
            ? `Form [${pokemonData.index + 1} of ${
                pokemonData.pages.length
              }] (✨ Shiny)`
            : `Form [${pokemonData.index + 1} of ${pokemonData.pages.length}]`,
        }),
    ],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [prevButton, shinyButton, nextButton],
      },
    ],
  });
};
