import { Client } from "discord.js";
import { getFiles } from "../util/get_files";
import * as path from "path";
import { pathToFileURL } from "url";

export const eventHandler = async (client: Client) => {
  const eventFolders = getFiles(path.join(__dirname, "../events"), true);

  eventFolders.forEach((folder, index) => {
    const eventFiles = getFiles(folder);
    eventFiles.sort((a, b) => a.localeCompare(b));

    const eventName = eventFolders[index].replace(/\\/g, "/").split("/").pop();

    console.log(`📁 Loading ${eventFiles.length} files for ${eventName}`);

    if (!eventName) return;

    client.on(eventName, async (...arg) => {
      eventFiles.forEach(async (file) => {
        const eventFunction = (await import(file)).default;

        eventFunction(client, ...arg);
      });
    });
  });
};
