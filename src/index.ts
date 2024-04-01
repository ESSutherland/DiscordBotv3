import "dotenv/config";
import { Client, IntentsBitField, Partials } from "discord.js";
import { eventHandler } from "./handlers/event_handler";
import mongoose from "mongoose";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildPresences,
  ],
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {});

    console.log("Connected to MongoDB");
    eventHandler(client);
    client.login(process.env.BOT_TOKEN);
  } catch (error) {
    console.error(error);
  }
})();
