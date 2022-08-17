export default {
  title: "EU",
  interval: 60,
  failCount: 3,
  testCases: {
    "A2S": async function({ a2s }) {
      let response = await a2s.info('0.0.0.0', 28015, 1000)
      return response && response.game == 'Rust'
    }
  }
}