"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = void 0;
const fs = require("fs");
const path = require("path");
const getFiles = (directory, foldersOnly = false) => {
    let fileNames = [];
    const files = fs.readdirSync(directory, { withFileTypes: true });
    files.forEach((file) => {
        const filePath = path.join(directory, file.name);
        if (foldersOnly) {
            if (file.isDirectory())
                fileNames.push(filePath);
        }
        else {
            if (file.isFile()) {
                fileNames.push(filePath);
            }
        }
    });
    return fileNames;
};
exports.getFiles = getFiles;
