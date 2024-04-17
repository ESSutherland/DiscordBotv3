import { Schema, model } from "mongoose";

const minecraftSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  minecraftUsername: {
    type: String,
    required: true,
  },
});

export default model("MinecraftUsers", minecraftSchema);
