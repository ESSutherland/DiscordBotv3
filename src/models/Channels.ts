import { Schema, model } from "mongoose";

const channelSchema = new Schema({
  channelId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export default model("Channels", channelSchema);
