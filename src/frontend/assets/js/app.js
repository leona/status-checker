import "/app/assets/css/style.css";
import axios from 'axios'
import Vue from 'vue'
    
Vue.createApp({
  data() {
    return {
      status: null,
      title: window.appConfig.title
    }
  },
  async mounted() {
    await this.watchStatus()
  },
  methods: {
    async watchStatus() {
      setInterval(this.updateStatus, 60 * 1000)
      await this.updateStatus()
    },
    async updateStatus() {
      try {
        let response = await axios.get('/api/status.json')
        this.status = response.data
      } catch(e) {
        console.error(e)
      }
    },
    statusText(status) {
      switch (status) {
        case "OK":
          return "Operational"
        case "PARTIAL_OUTAGE":
          return "Partial outage"
        case "MAJOR_OUTAGE":
          return "Major outage"
        default:
          return "Unknown"
      }
    },
    statusIcon(status) {
      return {
        'ok-icon': status === 'OK',
        'warn-icon': status === 'PARTIAL_OUTAGE',
        'error-icon': status === 'MAJOR_OUTAGE',
      }
    }
  }
}).mount('#app')