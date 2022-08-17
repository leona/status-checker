import express from "express"
import nunjucks from 'nunjucks'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { importAll } from "./lib/util.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const app = express();

nunjucks.configure('views', {
  express: app,
  autoescape: true
});

app.use(express.json());
app.set('view engine', 'html');
app.set('views', './views');
app.use(express.static('dist'))

let routes = await importAll('./routes')

for (let filename in routes) {
  let path = filename == 'index' ? '/' : '/' + filename;
  app.use(path, routes[filename])
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
