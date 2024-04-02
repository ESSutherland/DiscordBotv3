"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
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
exports.default = (0, mongoose_1.model)("Roles", roleSchema);
