"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const boostMessageSchema = new mongoose_1.Schema({
    guildId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("BoostMessage", boostMessageSchema);