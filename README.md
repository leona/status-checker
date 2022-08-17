<p align="center">
  <h1 align="center">status-checker</h1>
  <p align="center"><i>Reliability monitoring & alert solution</i></p>
</p>

## I. Example
![](https://i.imgur.com/M1CA4Vl.png)


## II. Features
* Easily create test cases in `./services`
* Logs stored in Mongodb for 30 days
* Discord webhook notifications

## III. Requirements
* `docker`
* `docker-compose`

## IV. Setup
* Clone the repo
* Create a `.env` file in the root based off `.env.example`
* Run `docker-compose --profile main up -d`

## V. Environment variables
* `NODE_ENV` - Set to `production` 
* `TITLE` - Title that appears on the webpage
* `THEME_BG` - Theme color
* `DB_USER` - Username to create Mongodb instance
* `DB_PASS` - Password for Mongodb instance
* `DB_AUTH_USER` - HTTP Basic auth username for accessing the mongo-express instance
* `DB_AUTH_PASS` - HTTP Basic auth password
* `PORT` - Port for NGINX e.g. 80
* `NGINX_DOMAIN_ROOT` - Domain of your status checker e.g. status.example.com
* `NGINX_DOMAIN_DB` - Domain of the mongodb-express instance e.g. status-db.example.com
* `DISCORD_WEBHOOK` - Webhook URL to send alert notifications

## V. Test cases
See examples in `./services/examples`

```js
export default {
  title: "Example Services", // Title that appears on the webpage
  interval: 60, // Interval in seconds to run test cases
  failCount: 3, // Number of failures before changing state and sending notifications
  testCases: {
    // http is an axios instance and a2s is a source query library
    // You can add multiple test cases with different keys.
    // A major outage is considered at least 50% of failed test cases.
    "PROTECTION_STATS": async function({ http, a2s }) {
      // Exceptions or not returning true will result in a test failure
      let response = await http.get('https://example.com/api/test-endpoint')
      return response.data.example >= 0
    }
  }
}
```