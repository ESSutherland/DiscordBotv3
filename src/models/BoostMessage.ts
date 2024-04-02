import { Schema, model } from "mongoose";

const boostMessageSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export default model("BoostMessage", boostMessageSchema);
