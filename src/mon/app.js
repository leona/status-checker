import { ServiceHandler } from "./lib/service-handler.js";
import { discordAlert } from "./hooks/discord.js";
import { xlog } from "./lib/util.js";

let serviceHandler = new ServiceHandler();
await serviceHandler.registerAll({ path: 'services' })

serviceHandler.on('serviceResult', async (data) => {
  xlog('Service result', data)
})

serviceHandler.on('updateState', discordAlert)
serviceHandler.start();