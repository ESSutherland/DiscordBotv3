"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const pokenode_ts_1 = require("pokenode-ts");
const data_1 = require("../../util/data");
const embed_helper_1 = require("../../util/embed_helper");
const blockedList = [
    "-cap",
    "-starter",
    "-rock-star",
    "-belle",
    "-pop-star",
    "-phd",
    "-libre",
    "-cosplay",
    "-totem",
    "-unknown",
    "-limited",
    "-sprinting",
    "-swimming",
    "-gliding",
    "-low-power",
    "-drive",
    "-aquatic",
    "-glide",
    "-construct",
];
exports.default = {
    data: {
        name: "pokemon",
        description: "Get information about a pokemon",
        options: [
            {
                name: "pokemon",
                description: "name or number of the pokemon",
                type: discord_js_1.ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
    callback: async (client, interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        await interaction.deferReply();
        const pokemonClient = new pokenode_ts_1.PokemonClient();
        const pokemonParam = interaction.options
            .getString("pokemon", true)
            .toLowerCase()
            .replace(" ", "-");
        if (!pokemonParam) {
            return interaction.editReply({
                embeds: [(0, embed_helper_1.errorEmbed)("No pokemon name or id provided")],
            });
        }
        const pokemonParamId = parseInt(pokemonParam);
        let pokemonSpecies;
        try {
            if (isNaN(pokemonParamId)) {
                pokemonSpecies = await pokemonClient.getPokemonSpeciesByName(pokemonParam);
            }
            else {
                pokemonSpecies = await pokemonClient.getPokemonSpeciesById(pokemonParamId);
            }
        }
        catch (error) {
            return interaction.editReply({
                embeds: [(0, embed_helper_1.errorEmbed)("No pokemon found with that name or id")],
            });
        }
        const varList = pokemonSpecies.varieties.reduce((array, variety, i) => {
            if (!blockedList.some((blocked) => variety.pokemon.name.includes(blocked)))
                array.push(variety);
            return array;
        }, []);
        let pageData = await Promise.all(varList.map(async (variety, index) => {
            const pokemonData = await pokemonClient.getPokemonByName(variety.pokemon.name);
            const abilities = await Promise.all(pokemonData.abilities.map(async (ability) => {
                const abilityData = await pokemonClient.getAbilityByName(ability.ability.name);
                const abilityName = abilityData.names.find((name) => name.language.name === "en")?.name;
                return ability.is_hidden ? `**${abilityName}**` : abilityName;
            }));
            const types = pokemonData.types
                .map((type) => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1))
                .join(", ");
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`${pokemonSpecies.names.find((name) => name.language.name === "en")
                ?.name} - #${pokemonSpecies.id.toString().padStart(4, "0")}`)
                .setDescription(pokemonSpecies.genera.find((genus) => genus.language.name === "en")
                ?.genus || "Unknown")
                .addFields([
                {
                    name: "Type(s)",
                    value: types,
                    inline: true,
                },
                {
                    name: "Abilities",
                    value: abilities.join("\n "),
                    inline: true,
                },
                {
                    name: "Height/Weight",
                    value: `${pokemonData.height / 10}m / ${pokemonData.weight / 10}kg`,
                    inline: true,
                },
                {
                    name: "HP",
                    value: pokemonData.stats[0].base_stat.toString() || "N/A",
                    inline: true,
                },
                {
                    name: "Attack",
                    value: pokemonData.stats[1].base_stat.toString() || "N/A",
                    inline: true,
                },
                {
                    name: "Defense",
                    value: pokemonData.stats[2].base_stat.toString() || "N/A",
                    inline: true,
                },
                {
                    name: "Sp. Atk",
                    value: pokemonData.stats[3].base_stat.toString() || "N/A",
                    inline: true,
                },
                {
                    name: "Sp. Def",
                    value: pokemonData.stats[4].base_stat.toString() || "N/A",
                    inline: true,
                },
                {
                    name: "Speed",
                    value: pokemonData.stats[5].base_stat.toString() || "N/A",
                    inline: true,
                },
            ])
                .setImage(pokemonData.sprites.other?.home.front_default || "")
                .setColor(interaction.guild?.members.me?.displayColor || 0)
                .setFooter({
                text: `Form [${index + 1} of ${varList.length}]`,
            });
            return [embed, pokemonData];
        }));
        pageData = pageData;
        if (!pageData)
            return;
        const embedPages = pageData.map((data) => data[0]);
        const pokemonData = pageData.map((data) => data[1]);
        const message = await interaction.fetchReply();
        data_1.pokemonMessageData.push({
            id: message.id,
            index: 0,
            pages: embedPages,
            pokemonData: pokemonData,
            isShiny: false,
        });
        if (embedPages.length === 0) {
            return interaction.editReply("No forms found for this pokemon");
        }
        const prevButton = new discord_js_2.ButtonBuilder()
            .setCustomId("prev")
            .setLabel("Previous Form")
            .setStyle(discord_js_2.ButtonStyle.Secondary)
            .setDisabled(data_1.pokemonMessageData.find((data) => data.id === message.id)?.index === 0);
        const shinyButton = new discord_js_2.ButtonBuilder()
            .setCustomId("shiny")
            .setLabel("Shiny")
            .setEmoji("✨")
            .setStyle(discord_js_2.ButtonStyle.Primary);
        const nextButton = new discord_js_2.ButtonBuilder()
            .setCustomId("next")
            .setLabel("Next Form")
            .setStyle(discord_js_2.ButtonStyle.Secondary)
            .setDisabled(data_1.pokemonMessageData.find((data) => data.id === message.id)?.index ===
            pokemonSpecies.varieties.length - 1);
        await interaction.editReply({
            embeds: [embedPages[0]],
            components: [
                {
                    type: discord_js_2.ComponentType.ActionRow,
                    components: [prevButton, shinyButton, nextButton],
                },
            ],
        });
    },
};
