import io from 'socket.io-client';
import rdfstore from 'rdfstore';
import Promise, { promisify } from 'bluebird';

const rdfstoreCreate = promisify(rdfstore.create.bind(rdfstore));

export default class Beltline {

  constructor(connectUrl) {
    this.subscriptions = {};
    this.methods = {};
    this.isServer = false;

    this.socket = io(connectUrl);
    this.socket.on('connect', () => {
      console.log('connected to beltline');
    });
    this.socket.on('update', ({ id, graph }) => this.onUpdate(id, graph));
    this.socket.on('published', ({ id, graph, query }) => this.onPublished(id, graph, query))
  }

  async onUpdate(id, graph) {
    if (this.subscriptions[id]) {
      const subscription = this.subscriptions[id];
      await promisify(subscription.store.clear.bind(subscription.store))();
      await promisify(subscription.store.load.bind(subscription.store))('text/n3', graph);
      await subscription.onUpdate(
        await promisify(subscription.store.execute.bind(subscription.store))(subscription.query)
      );
    } else {
      console.warn('Received an update with a subscription id that does not exist');
    }
  }
  
  async onPublished(id, graph, query) {
    if (this.subscriptions[id]) {
      this.subscriptions[id].query = query;
      this.subscriptions[id].loaded = true;
      await this.onUpdate(id, graph);
    } else {
      console.warn('Received a published with a subscription id that does not exist');
    }
  }

  async subscribe(subscriptionName, params, onSubscriptionUpdated) {
    const id = `${subscriptionName}${JSON.stringify(params)}`;
    if (this.subscriptions[id]) {
      this.subscriptions[id].isActive = true;
      this.subscriptions[id].onUpdate = onSubscriptionUpdated;
    } else {
      this.subscriptions[id] = {
        id,
        isActive: true,
        loaded: false,
        store: await rdfstoreCreate(),
        onUpdate: onSubscriptionUpdated
      }
    }
    const subscription = this.subscriptions[id];
    this.socket.emit('subscribe', {
      id,
      subscriptionName,
      params
    });
  }

  method(methodName, method) {
    this.methods[methodName] = method;
  }

  async call(methodName, params) {
    if (this.methods[methodName]) {
      this.socket.emit('call', {
        methodName,
        params
      });
      await Promise.map(Object.values(this.subscriptions), async (subscription) => {
        if (subscription.loaded) {
          await this.methods[methodName](params, subscription.store);
          const graph = await subscription.store.execute(subscription.query);
          await this.onUpdate(subscription.id, graph);
        }
      });
    } else {
      console.warn(`Method ${methodName} is not registered.`);
    }
  }

  unsubscribe(subscription) {
    this.subscriptions[subscription.id].isActive = false;
    this.socket.emit('unsubscribe', { id: subscription.id });
  }
}