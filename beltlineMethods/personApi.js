
export default function(beltline) {
  if (beltline.isServer) {
    beltline.publish('people', () => {
      return `
        PREFIX f: <http://example.com/owl/families#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        CONSTRUCT { ?s ?p ?o } WHERE { ?s rdf:type f:Person . ?s ?p ?o }
      `;
    });

    beltline.publish('person', ({ id }) => {
      return `
        PREFIX f: <http://example.com/owl/families#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        CONSTRUCT { ?s ?p ?o } WHERE {
          f:${id} ?p ?o .
          ?s rdf:type f:Person .
          ?s ?p ?o 
        }
      `;
    });
  }

  beltline.method('changeName', async ({ id, newName }, db) => {
    console.log('calling');
    await db.execute(`
      PREFIX f: <http://example.com/owl/families#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      DELETE { f:${id} rdf:name ?o }
      INSERT { f:${id} rdf:name "${newName}"^^xsd:string . }
      WHERE  { f:${id} rdf:name ?o . }
    `);
  });
}