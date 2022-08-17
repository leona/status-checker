import { ServiceHandler } from "../lib/service-handler.js";

export let serviceHandler = new ServiceHandler();
await serviceHandler.registerAll({ path: 'services' })
