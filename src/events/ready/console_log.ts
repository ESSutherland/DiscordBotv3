import { ActivityType, Client } from "discord.js";

const consoleLog = async (client: Client) => {
  client.user?.setActivity("In The Snow. | /help", {
    type: ActivityType.Playing,
  });

  console.log(`✅ ${client.user?.tag} is online!`);
};

export default consoleLog;
