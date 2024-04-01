import { Schema, model } from "mongoose";

const roleSchema = new Schema({
  roleId: {
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

export default model("Roles", roleSchema);
