import io from 'socket.io-client';

export default class Beltline {
  static socket; 

  constructor(connectUrl) {
    this.socket = io(connectUrl);
    this.socket.on('connect', () => {
      console.log('connected on front end');
    });
  }
}