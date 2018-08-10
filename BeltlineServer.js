
import socketIO from 'socket.io';

export default class BeltlineServer {
  static io;

  constructor(app) {
    console.log('Constructing App');

    this.io.on('connection', (socket) => {
      console.log('connected');
    });
  }
}