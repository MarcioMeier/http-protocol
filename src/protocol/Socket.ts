import * as net from 'net';

export class Socket {
  private net: net.Server;
  private connections: Array<net.Socket>;

  constructor(private onData: any) {
    this.net = new net.Server();
    this.connections = [];
  }

  async connect(port: number, callback: any): Promise<void> {
    this.net.listen(port, callback);

    this.net.on('connection', (socket: net.Socket) => {
      
      this.registerSocket(socket);

      socket.setTimeout(2000);
      socket.on('data', (data) => this.onData(data, socket));

      socket.on('timeout', () => socket.destroy());
      socket.on('close', () => this.removeSocket(socket));
    });
  }

  private registerSocket(socket: net.Socket) {
    this.connections.push(socket);
  }

  private removeSocket(socket: net.Socket) {
    const index = this.connections.findIndex(s => s.address === socket.address);
    if (index >= 0) {
      this.connections.splice(index, 1);
    }
  }

  send(socket: net.Socket, str: string): void {
    socket.write(str, 'utf8');
  }

}