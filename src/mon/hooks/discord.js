import { xlog } from "../lib/util.js";
import { sendEmbed } from "../lib/discord.js";

export async function discordAlert({ service, result }) {
  xlog("Sending discord alert", result)
  let color

  switch(result.status) {
    case 'OK':
      color = 'green'
      break
    case 'PARTIAL_OUTAGE':
      color = 'orange'
      break
    case 'MAJOR_OUTAGE':
      color = 'red'
      break
  }
  
  var keys = Object.keys(result.tests);

  var failedTests = keys.filter(function(key) {
      return !result.tests[key]
  })

  await sendEmbed("Service status alert", [
    {
      name: "Service",
      value: service.title,
      inline: true
    },
    {
      name: "Status",
      value: result.status,
      inline: true
    },
    {
      name: "Failed tests",
      value: failedTests && failedTests.length ? failedTests.join('\n') : 'None',
    }
  ], color)
}