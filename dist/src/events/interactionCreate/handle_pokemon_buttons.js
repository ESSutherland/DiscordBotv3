"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const data_1 = require("../../util/data");
exports.default = async (client, interaction) => {
    if (!interaction.isButton())
        return;
    const pokemonData = data_1.pokemonMessageData.find((data) => data.id === interaction.message.id);
    if (!pokemonData)
        return;
    if (interaction.customId === "prev") {
        interaction.deferUpdate();
        if (pokemonData.index === 0)
            return;
        pokemonData.index--;
        pokemonData.isShiny = false;
    }
    if (interaction.customId === "shiny") {
        interaction.deferUpdate();
        pokemonData.isShiny = !pokemonData.isShiny;
    }
    if (interaction.customId === "next") {
        interaction.deferUpdate();
        if (pokemonData.index === pokemonData.pages.length - 1)
            return;
        pokemonData.index++;
        pokemonData.isShiny = false;
    }
    const prevButton = new discord_js_1.ButtonBuilder()
        .setCustomId("prev")
        .setLabel("Previous Form")
        .setStyle(discord_js_1.ButtonStyle.Secondary)
        .setDisabled(pokemonData.index === 0);
    const shinyButton = new discord_js_1.ButtonBuilder()
        .setCustomId("shiny")
        .setLabel("Shiny")
        .setEmoji("✨")
        .setStyle(discord_js_1.ButtonStyle.Primary);
    const nextButton = new discord_js_1.ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next Form")
        .setStyle(discord_js_1.ButtonStyle.Secondary)
        .setDisabled(pokemonData.index === pokemonData.pages.length - 1);
    interaction.message.edit({
        embeds: [
            pokemonData.pages[pokemonData.index].setImage(pokemonData.isShiny
                ? pokemonData.pokemonData[pokemonData.index].sprites.other?.home
                    .front_shiny || ""
                : pokemonData.pokemonData[pokemonData.index].sprites.other?.home
                    .front_default || ""),
        ],
        components: [
            {
                type: discord_js_1.ComponentType.ActionRow,
                components: [prevButton, shinyButton, nextButton],
            },
        ],
    });
};
