
import socketIO from 'socket.io';

export default class BeltlineServer {
  static io;
  static db;
  static publishHandlers = {};
  static queries = {};
  static methods = {};

  constructor(app, databaseConnection) {
    this.db = databaseConnection;

    this.io = socketIO(app);

    this.io.on('connection', (socket) => {
      socket.on('subscribe', ({
        id,
        subscriptionName,
        params
      }) => this.onSubscribe(id, subscriptionName, params, socket));
      socket.on('call', ({ methodName, params }) => this.onCall(methodName, params, socket));
      socket.on('unsubscribe', ({ 
        id
      }) => this.onUnsubscribe(id, socket));
      socket.on('disconnect', () => this.onDisconnect(socket))
    });
  }

  async onSubscribe(id, subscriptionName, params, socket) {
    if (this.publishHandlers[subscriptionName]) {
      const query = this.publishHandlers[subscriptionName](params);
      if (this.queries[query]) {
        this.queries[query].push({ id, subscriptionName, socket })
      } else {
        this.queries[query] = [{ id, subscriptionName, socket }];
      }
      const graph = await this.db.execute(query);
      socket.emit('published', {
        id,
        graph,
        query
      });
    } else {
      console.warn(`No publish found for ${subscriptionName}`)
    }
  }

  async onCall(methodName, params, socket) {
    await this.methods[methodName](params);
    await Promise.map(Object.keys(this.queries), (query) => {
      const clientInfo = this.queries[query];
      const graph = await this.db.execute(query);
      clientInfo.forEach((client) => {
        client.socket.emit('update', { id: cleint.id, graph })
      });
    });
  }

  onUnsubscribe(id, socket) {
    Object.keys(this.queries).forEach((query) => {
      this.queries[query] = this.queries[query].filter(clientInfo => clientInfo.id !== id);
    });
  }

  onDisconnect(socket) {
    Object.keys(this.queries).forEach((query) => {
      this.queries[query] = this.queries[query].filter(clientInfo => clientInfo.socket !== socket);
    });
  }

  publish(subscriptionName, publishHandler) {
    this.publishHandlers[subscriptionName] = publishHandler;
  }

  method(methodName, method) {
    this.methods[methodName] = method;
  }
}