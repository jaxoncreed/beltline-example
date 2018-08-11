import BeltlineServer from './BeltlineServer';
import initDatabase from './BeltlineLocalStorageDatabase';

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
  console.log('here be db');
  console.log(db);
  db.execute('LOAD <http://dbpedia.org/resource/Tim_Berners-Lee> INTO GRAPH <http://example.org/people>');
  // await db.load('text/turtle', )
  console.log('between');
  console.log(await db.execute(
    'PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
                     PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
                     PREFIX : <http://example.org/>\
                     SELECT ?s FROM NAMED :people { GRAPH ?g { ?s rdf:type foaf:Person } }'
  ));
  const beltline = new BeltlineServer(server, db);
});

server.listen(port, (error) => {
  if (error) {
    console.log(error); // eslint-disable-line no-console
  }
  console.info('Express is listening on port %s.', port); // eslint-disable-line no-console
});
