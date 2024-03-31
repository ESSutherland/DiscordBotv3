import { Client } from "discord.js";
import { test_server } from "../../../config.json";
import { getLocalCommands } from "../../util/get_local_commands";
import { getApplicationCommands } from "../../util/get_application_commands";
import { areCommandsDifferent } from "../../util/are_commands_different";

export default async (client: Client) => {
  try {
    let localCommands = await getLocalCommands();

    localCommands = localCommands.filter((command) => command !== null);
    const applicationCommands = await getApplicationCommands(
      client,
      test_server
    );

    if (!applicationCommands) {
      console.error("❌ Could not fetch application commands.");
      return;
    }

    localCommands.forEach(async (command: any) => {
      console.log(command.data.name);

      const { name, description, options } = command.data;

      const existingCommand = applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (command.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`🗑️ Deleted command: ${name}`);
          return;
        }

        if (areCommandsDifferent(existingCommand, command.data)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });
          console.log(`🔁 Edited command: ${name}`);
        }
      } else {
        if (command.deleted) {
          console.log(`⏩ Skipping command: ${name}`);
          return;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`🆕 Created command: ${name}`);
      }
    });

    applicationCommands.cache.forEach(async (command) => {
      if (!localCommands.find((cmd) => cmd.data.name === command.name)) {
        await applicationCommands.delete(command.id);
        console.log(`🗑️ Deleted command: ${command.name}`);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
