export class Emitter {

  callbacks = {}

  on(key, callback) {
    if (!this.callbacks[key]) {
      this.callbacks[key] = []
    }

    this.callbacks[key].push(callback)
  }

  emit(key, result) {
    if (this.callbacks[key]) {
      this.callbacks[key].forEach(callback => callback(result))
    }
  }
}