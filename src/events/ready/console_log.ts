import { ActivityType, Client } from "discord.js";

export default async (client: Client) => {
  client.user?.setActivity("In The Snow. | /help", {
    type: ActivityType.Playing,
  });

  console.log(`✅ ${client.user?.tag} is online!`);
};
