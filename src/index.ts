import "dotenv/config";
import { Client, IntentsBitField, Partials } from "discord.js";
import { eventHandler } from "./handlers/event_handler";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildModeration,
  ],
});

eventHandler(client);

client.login(process.env.BOT_TOKEN);
