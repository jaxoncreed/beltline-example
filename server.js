import BeltlineServer from './BeltlineServer';
import initDatabase from './BeltlineLocalStorageDatabase';
import util from 'util';
import fs from 'fs';

const path = require('path');
const express = require('express');

const app = express();

const server = require('http').createServer(app);

const port = process.env.PORT ? process.env.PORT : 8080;
const dist = path.join(__dirname, 'dist');

app.use(express.static(dist));

app.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

initDatabase(async (db) => {
  const initttl = await util.promisify(fs.readFile)('./example.ttl', 'utf8');
  await db.load('text/turtle', initttl);
  const beltline = new BeltlineServer(server, db);
});

server.listen(port, (error) => {
  if (error) {
    console.log(error); // eslint-disable-line no-console
  }
  console.info('Express is listening on port %s.', port); // eslint-disable-line no-console
});
