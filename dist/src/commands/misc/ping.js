"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: {
        name: "ping",
        description: "Replies with the bot's latency.",
    },
    callback: async (client, interaction) => {
        const embed = new discord_js_1.EmbedBuilder();
        await interaction.deferReply();
        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;
        embed.setTitle("Pong!");
        embed.setDescription("Here are the latencies:");
        embed.addFields([
            {
                name: "Client Latency",
                value: `${ping} ms`,
                inline: true,
            },
            {
                name: "Websocket Latency",
                value: `${client.ws.ping} ms`,
                inline: true,
            },
        ]);
        embed.setColor(interaction.guild?.members.me?.displayColor || "Random");
        interaction.editReply({
            embeds: [embed],
        });
    },
};
