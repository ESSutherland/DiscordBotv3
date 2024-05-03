import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import {
  ButtonBuilder,
  ButtonStyle,
  Client,
  CommandInteraction,
  ComponentType,
} from "discord.js";
import { Pokemon, PokemonClient, PokemonSpeciesVariety } from "pokenode-ts";
import { pokemonMessageData } from "../../util/data";
import { errorEmbed } from "../../util/embed_helper";

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

export default {
  data: {
    name: "pokemon",
    description: "Get information about a pokemon",
    options: [
      {
        name: "pokemon",
        description: "name or number of the pokemon",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  callback: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    await interaction.deferReply();

    const pokemonClient = new PokemonClient();
    const pokemonParam = interaction.options
      .getString("pokemon", true)
      .toLowerCase()
      .replace(" ", "-");

    if (!pokemonParam) {
      return interaction.editReply({
        embeds: [errorEmbed("No pokemon name or id provided")],
      });
    }

    const pokemonParamId = parseInt(pokemonParam);

    let pokemonSpecies;

    try {
      if (isNaN(pokemonParamId)) {
        pokemonSpecies = await pokemonClient.getPokemonSpeciesByName(
          pokemonParam
        );
      } else {
        pokemonSpecies = await pokemonClient.getPokemonSpeciesById(
          pokemonParamId
        );
      }
    } catch (error) {
      return interaction.editReply({
        embeds: [errorEmbed("No pokemon found with that name or id")],
      });
    }

    const varList: PokemonSpeciesVariety[] = pokemonSpecies.varieties.reduce(
      (array: PokemonSpeciesVariety[], variety: PokemonSpeciesVariety, i) => {
        if (
          !blockedList.some((blocked) => variety.pokemon.name.includes(blocked))
        )
          array.push(variety);
        return array;
      },
      []
    );

    let pageData = await Promise.all(
      varList.map(async (variety, index) => {
        const pokemonData = await pokemonClient.getPokemonByName(
          variety.pokemon.name
        );

        const abilities = await Promise.all(
          pokemonData.abilities.map(async (ability) => {
            const abilityData = await pokemonClient.getAbilityByName(
              ability.ability.name
            );
            const abilityName = abilityData.names.find(
              (name) => name.language.name === "en"
            )?.name;

            return ability.is_hidden ? `**${abilityName}**` : abilityName;
          })
        );

        const types = pokemonData.types
          .map(
            (type) =>
              type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
          )
          .join(", ");

        const embed = new EmbedBuilder()
          .setTitle(
            `${
              pokemonSpecies.names.find((name) => name.language.name === "en")
                ?.name
            } - #${pokemonSpecies.id.toString().padStart(4, "0")}`
          )
          .setDescription(
            pokemonSpecies.genera.find((genus) => genus.language.name === "en")
              ?.genus || "Unknown"
          )
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
              value: `${pokemonData.height / 10}m / ${
                pokemonData.weight / 10
              }kg`,
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
      })
    );

    pageData = pageData;

    if (!pageData) return;

    const embedPages = pageData.map((data) => data[0]) as EmbedBuilder[];
    const pokemonData = pageData.map((data) => data[1]) as Pokemon[];

    const message = await interaction.fetchReply();
    pokemonMessageData.push({
      id: message.id,
      index: 0,
      pages: embedPages,
      pokemonData: pokemonData,
      isShiny: false,
    });

    if (embedPages.length === 0) {
      return interaction.editReply("No forms found for this pokemon");
    }

    const prevButton = new ButtonBuilder()
      .setCustomId("prev")
      .setLabel("Previous Form")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(
        pokemonMessageData.find((data) => data.id === message.id)?.index === 0
      );

    const shinyButton = new ButtonBuilder()
      .setCustomId("shiny")
      .setLabel("Shiny")
      .setEmoji("✨")
      .setStyle(ButtonStyle.Primary);

    const nextButton = new ButtonBuilder()
      .setCustomId("next")
      .setLabel("Next Form")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(
        pokemonMessageData.find((data) => data.id === message.id)?.index ===
          pokemonSpecies.varieties.length - 1
      );

    await interaction.editReply({
      embeds: [embedPages[0]],
      components: [
        {
          type: ComponentType.ActionRow,
          components: [prevButton, shinyButton, nextButton],
        },
      ],
    });
  },
};
