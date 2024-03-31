import { EmbedBuilder } from "discord.js";
import { Pokemon } from "pokenode-ts";

export type MessageData = {
  id: string;
  index: number;
  pages: EmbedBuilder[];
  pokemonData: Pokemon[];
  isShiny: boolean;
};

export const pokemonMessageData: MessageData[] = [];
