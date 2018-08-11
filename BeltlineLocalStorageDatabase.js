import rdfstore from 'rdfstore';
import util from 'util';

export class BeltlineLocalStorageDatabase {

  static store;

  constructor() {
    
  }

  async loadDataFromFile() {
    
  }

  async initDatabase() {
    this.store = await util.promisify(rdfstore.create.bind(rdfstore))();
  }

  async execute(query) {
    return await util.promisify(this.store.execute.bind(this.store))(query);
  }
}

export default async function initDatabase(func) {
  const db = new BeltlineLocalStorageDatabase();
  await db.initDatabase();
  if (func) {
    func(db);
  }
}