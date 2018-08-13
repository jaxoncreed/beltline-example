
import socketIO from 'socket.io';

export default class BeltlineServer {
  static io;
  static db;
  static publishHandlers = {};
  static queries = {};

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
        this.queries[query].push({ id, subscriptionName })
      } else {
        this.queries[query] = [{ id, subscriptionName }];
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

  onCall(methodName, params, socket) {

  }

  onUnsubscribe(id, socket) {

  }

  onDisconnect(socket) {

  }

  publish(subscriptionName, publishHandler) {

  }

  method(methodName, method) {

  }
}