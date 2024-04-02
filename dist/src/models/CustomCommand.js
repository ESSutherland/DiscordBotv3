"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commandSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("Commands", commandSchema);
