import * as net from 'net';

import { IResponse } from './IResponse';
import { IRequest } from './IRequest';
import { Request } from './Request';
import { Response } from './Response';
import { Socket } from "./Socket";
import { Endpoint } from './Endpoint';

export class Http {
  private socket: Socket;
  private endpoints:Array<Endpoint>;

  constructor() {
    this.socket = new Socket(this.processRequest.bind(this));
    this.endpoints = [];
  }

  async start(port: number = 80, callback: any) {
    return this.socket.connect(port, callback)
  }
  
  registerEndpoint(method: string, route: string, handler: any): void {
    this.endpoints.push(new Endpoint(
      method,
      route,
      handler
    ));
  }

  private async processRequest(data: Buffer, socket: net.Socket) {
    const request: IRequest = this.createRequest(data.toString());
    console.log(JSON.stringify(request, null, 2));

    const response = new Response();
    const endpoint = this.findEndpoint(request.method, request.resource);


    if (endpoint) {
      await endpoint.processRequest(request, response);
    }

    socket.write(this.mountResponse(request, response))
  }

  private findEndpoint(method: string, route: string): Endpoint | void {
    const index = this.endpoints.findIndex(endpoint => endpoint.method === method && endpoint.route === route);
    if (index >= 0) return this.endpoints[index];
  }

  private createRequest(strRequest: string): IRequest {
    const args = strRequest.split('\r\n')

    const [method, resourceStr] = args.splice(0,1)[0].split(' ');
    const { resource, params } = this.destructQueryString(resourceStr);

    const headers: { [key: string]: string } = {};

    let header = '';
    do {
      header = args.splice(0,1)[0];

      if (header !== '') {
        const [key, value] = header.split(': ')

        headers[this.kebabToCammel(key)] = value;
      }

    } while(header !== '');

    // ? After last header there is a empty line
    args.splice(0,1)

    // ? The rest of arguments are the body
    const body = args.join('\r\n')

    return new Request(method, resource, headers, params, body);
  }

  private destructQueryString(str: string): { resource: string, params: {}} {
    const [resource, query] = str.split('?');

    if (!query) return { resource, params: {}}

    const args = query.substr(1).split('&')
    const params: {[key: string]: any} = {};

    for (const param of args) {
      const [key, value] = param.split('=');
      params[key] = value;
    }

    return { resource, params };
  }

  private kebabToCammel(name: string) {
    const firtLetter = name.substr(0,1)
    const cammel = name.substr(1).replace(/-([a-zA-Z])/g, (g) => g[1].toUpperCase());

    return `${firtLetter.toLowerCase()}${cammel}`;
  }
  

  private mountResponse(req: IRequest, res: IResponse): string {
    // TODO IMPLEMENTAR
    return res.body;
  }
}