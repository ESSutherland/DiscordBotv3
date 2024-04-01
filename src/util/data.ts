import { EmbedBuilder } from "discord.js";
import { Pokemon } from "pokenode-ts";

export type PokemonMessageData = {
  id: string;
  index: number;
  pages: EmbedBuilder[];
  pokemonData: Pokemon[];
  isShiny: boolean;
};

export const pokemonMessageData: PokemonMessageData[] = [];

export type CommandMessageData = {
  id: string;
  index: number;
  pages: EmbedBuilder[];
};

export const commandMessageData: CommandMessageData[] = [];
