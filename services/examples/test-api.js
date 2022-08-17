export default {
  title: "Test API",
  interval: 60,
  failCount: 3,
  testCases: {
    "PROTECTION_STATS": async function({ http }) {
      let response = await http.get('https://example.com/api/test-endpoint')
      return response.data.example >= 0
    }
  }
}