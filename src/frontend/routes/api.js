import express from 'express'
import logs from '../lib/logs.js'
import { serviceHandler } from '../models/instances.js'

let router = express.Router();
let services = serviceHandler.keys.sort()

router.get('/status.json', async (req, res) => {
  let latest = (await logs.fetchLatest()).map((item) => {
    let service = serviceHandler.getService(item.service)
    if (!service) return
    item.title = service.title
    return item
  }).filter(item => item)

  let metrics = await logs.fetchMetrics(services)
  let majorOutages = latest.filter(log => log.status === 'MAJOR_OUTAGE').length
  let partialOutages = latest.filter(log => log.status === 'PARTIAL_OUTAGE').length
  let overall = 'OK'

  if (partialOutages > 0 || majorOutages > 0) {
    overall = 'PARTIAL_OUTAGE'
  }

  if (majorOutages >= latest.length / 2) {
    overall = 'MAJOR_OUTAGE'
  }

  res.status(200).json({
    latest,
    metrics,
    overall
  })
})

export default router