import { Schema, model } from "mongoose";

const commandSchema = new Schema({
  authorId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  command: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

export default model("Commands", commandSchema);
