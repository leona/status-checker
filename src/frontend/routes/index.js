import express from 'express'
import { timestamp, xlog } from '../lib/util.js'

let router = express.Router();
const buildTime = timestamp()

router.get('/', async (req, res) => {
  res.render('index.html', {
    buildTime,
    config: {
      title: process.env.TITLE,
      themeBg: process.env.THEME_BG,
    }
  })
});

export default router