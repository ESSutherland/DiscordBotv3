"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const data_1 = require("../../util/data");
exports.default = async (client, interaction) => {
    if (!interaction.isButton())
        return;
    const commandData = data_1.commandMessageData.find((data) => data.id === interaction.message.id);
    if (!commandData)
        return;
    if (interaction.customId === "prev") {
        interaction.deferUpdate();
        if (commandData.index === 0)
            return;
        commandData.index--;
    }
    if (interaction.customId === "next") {
        interaction.deferUpdate();
        if (commandData.index === commandData.pages.length - 1)
            return;
        commandData.index++;
    }
    const prevButton = new discord_js_1.ButtonBuilder()
        .setCustomId("prev")
        .setLabel("Previous Form")
        .setStyle(discord_js_1.ButtonStyle.Secondary)
        .setDisabled(commandData.index === 0);
    const nextButton = new discord_js_1.ButtonBuilder()
        .setCustomId("next")
        .setLabel("Next Form")
        .setStyle(discord_js_1.ButtonStyle.Secondary)
        .setDisabled(commandData.index === commandData.pages.length - 1);
    interaction.message.edit({
        embeds: [commandData.pages[commandData.index]],
        components: [
            {
                type: discord_js_1.ComponentType.ActionRow,
                components: [prevButton, nextButton],
            },
        ],
    });
};
