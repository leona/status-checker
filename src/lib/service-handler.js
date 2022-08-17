import axios from 'axios'
import { xlog } from '../lib/util.js'
import { Service } from './service.js'
import { Emitter } from '../lib/emitter.js'
import { importAll } from "../lib/util.js";
import logs from "../lib/logs.js";
import query from 'source-server-query';

export class ServiceHandler extends Emitter {

  services = {}

  constructor() {
    super()
    this.http = axios.create()
    this.http.defaults.timeout = 10000
  }

  get keys() {
    return Object.keys(this.services)
  }

  register(name, service) {
    this.services[name] = new Service({
      key: name,
      ...service
    })
  }

  async registerAll({ path }) {
    let services = await importAll(path);

    for (let name in services) {
      this.register(name, services[name]);
    }
  }

  getService(key) {
    return this.services[key]
  }

  async eachService(callback) {
    for (let key in this.services) {
      await callback(this.getService(key))
    }
  }

  async outputCall(output, service) {
    if (await logs.updateState(output.status, service)) {
      this.emit('updateState', {
        service: service,
        result: output
      })
    }

    this.emit("serviceResult", output)
    logs.addLog(output)
  }

  async serviceCall(service) {
    let tests = await service.runTestCases({ http: this.http, a2s: query })

    let output = {
      service: service.key,
      tests: tests.results,
      status: tests.evaluation,
      timestamp: new Date()
    }

    this.outputCall(output, service)
  }

  start() {
    this.eachService(async (service) => {
      xlog(`Starting service worker: ${service.key} to run every ${service.interval} seconds`)
      setInterval(this.serviceCall.bind(this, service), service.interval * 1000)
      await this.serviceCall(service)
    })
  }
}