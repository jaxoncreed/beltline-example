
import socketIO from 'socket.io';

export default class BeltlineServer {
  static io;
  static db;

  constructor(app, databaseConnection) {
    console.log('Constructing App');
    this.db = databaseConnection;

    this.io = socketIO(app);

    this.io.on('connection', (socket) => {
      console.log('connected');
    });
  }
}