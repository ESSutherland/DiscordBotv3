"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const channelSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("Channels", channelSchema);
