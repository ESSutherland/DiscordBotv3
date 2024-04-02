import { Client } from "discord.js";
import { getLocalCommands } from "../../util/get_local_commands";
import { getApplicationCommands } from "../../util/get_application_commands";
import { areCommandsDifferent } from "../../util/are_commands_different";

export default async (client: Client) => {
  try {
    let localCommands = await getLocalCommands();
    const guild = client.guilds.cache.first();

    if (!guild) {
      console.error("❌ Could not fetch guild.");
      return;
    }

    const serverId = guild.id;

    localCommands = localCommands.filter((command) => command !== null);
    const applicationCommands = await getApplicationCommands(client, serverId);

    if (!applicationCommands) {
      console.error("❌ Could not fetch application commands.");
      return;
    }

    localCommands.forEach(async (command: any) => {
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
        }
      } else {
        if (command.deleted) {
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
