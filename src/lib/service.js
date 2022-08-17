import { xlog } from '../lib/util.js'

export class Service {

  constructor({ key, title, interval, testCases, failCount }) {
    this.key = key
    this.title = title
    this.interval = interval
    this.testCases = testCases
    this.failCount = failCount
  }

  evaluate(results) {
    let failCount = Object.values(results).filter(result => !result).length
    if (failCount == Object.values(this.testCases).length) return "MAJOR_OUTAGE"
    if (failCount > 0) return "PARTIAL_OUTAGE"
    return "OK"
  }

  async runTestCases(opts) {
    let results = {}

    for (let key in this.testCases) {
      xlog("Running test case:", key)
      
      try {
        results[key] = (await this.testCases[key](opts)) || false
      } catch(e) {
        xlog("Error running test case:", key, e)
        results[key] = false
      }
    }

    return {
      evaluation: this.evaluate(results),
      results
    }
  }
}