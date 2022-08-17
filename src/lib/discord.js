import axios from 'axios'
import { xlog } from '../lib/util.js'

export async function sendEmbed(title, fields, color) {
  xlog("Sending discord alert", JSON.stringify(fields))
  
  switch(color) {
    case 'red':
      color = 15158332
      break
    case 'orange':
      color = 15105570
      break
    case 'green':
      color = 3066993
      break
    default:
      color = 8359053
  }

  let data = [
    {
      title,
      color,
      footer: {
        text: `status-checker ${new Date().toLocaleDateString("en-US")}`,
      },
      fields
    },
  ];

  try {
    await axios.post(process.env.DISCORD_WEBHOOK, {
      embeds: data,
    }, {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    xlog("Failed to send discord webhook", error.response.data)
  }
}