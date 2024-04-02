import * as path from "path";
import { getFiles } from "./get_files";
import { pathToFileURL } from "url";

export const getLocalCommands = async (exceptions?: string[]) => {
  let localCommands: any[] = [];

  const commandCategories = getFiles(path.join(__dirname, "../commands"), true);

  commandCategories.forEach((category) => {
    const commandFiles = getFiles(category);

    let commandPromises = commandFiles.map(async (command) => {
      const commandImport = await import(command);
      const commandObject = commandImport.default;

      if (exceptions?.includes(commandObject.data.name)) {
        return null;
      }

      return commandObject;
    });

    localCommands.push(...commandPromises);
  });

  return await Promise.all(localCommands);
};
