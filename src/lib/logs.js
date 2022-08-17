import { db } from '../lib/db.js'
import { offsetDate, xlog, eachDates, nth } from '../lib/util.js'

async function fetchLatest() {
  return await db.collection('logs').aggregate([
    { $match: { timestamp: { $gt: offsetDate(-1) } } },
    { $sort : { timestamp : -1 } },
    {
      $group: {
        _id: "$service",
        tests: { "$first": "$tests" },
        timestamp: { "$first": "$timestamp" },
        service: { "$first": "$service" },
        status: { "$first": "$status" },
      },
    },
    { $project: { _id:false, tests:true, timestamp: true, service: true, status: true } },
    { $sort : { service : 1 } },
  ]).toArray()
}

async function addLog(data) {
  xlog("Adding log:", data)
  await db.collection('logs').insertOne(data)
}

async function addEvent(data) {
  xlog("Adding event:", data)
  await db.collection('events').insertOne(data)
}

async function updateState(status, service) {
  let result = await db.collection('logs').find({
    service: service.key
  }).sort({ timestamp: -1 }).limit(service.failCount + 1).toArray()

  if (result.length < service.failCount + 1) {
    xlog("Not enough logs to evaluate service:", service.key)
    return
  }

  let hasRepeated = result.slice(0, service.failCount).filter(item => item.status == status).length == service.failCount - 1
  let isFirstRepeat = result.slice(-1)[0].status !== status


  if (hasRepeated && isFirstRepeat) {
    addEvent({
      service: service.key,
      status,
      timestamp: new Date()
    })

    return true
  }
}

async function fetchOutages() {
  return await db.collection('events').aggregate([
    {
        $match: {
          $and:[
            {
              "$or":[
              { "status": "MAJOR_OUTAGE" },
              { "status": "PARTIAL_OUTAGE" }
            ]},
          ]
        }
    },
    { $sort : { status: 1 } },
    {
      $group: {
        _id: { dateFormated: { $dateToString: { format: "%d-%m-%Y", date: "$timestamp" }}, service: "$service"},
        service: { "$first": "$service" },
        status: { "$first": "$status" },
        timestamp: { "$first": "$timestamp" },
      }
    },
    { $project: { _id:false, service: true, status: true, timestamp: true } },
    { $sort : { timestamp: 1 } },
  ]).toArray()
}

async function fetchMetrics(services) {
  let outages = await fetchOutages()
  let dates = eachDates(30).reverse()
  let metrics = []

  for (let i = 0; i < 30; i++) {
    metrics.push({
      date: dates[i],
      statuses: []
    })

    for (let x = 0; x < services.length; x++) {
      let outage = outages.find(item => item.service == services[x] && `${item.timestamp.getDate()}/${item.timestamp.getMonth() + 1}` == dates[i])
      metrics[i].statuses.push(outage && outage.status ? outage.status : 'OK')
    }
  }

  return metrics.map(item => {
    let day = item.date.split('/')[0]
    item.date = `${day}${nth(day)}`
    return item
  })
}

export default {
  fetchLatest,
  fetchOutages,
  updateState,
  addEvent,
  addLog,
  fetchMetrics
}