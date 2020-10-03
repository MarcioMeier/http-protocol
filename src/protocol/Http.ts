import * as net from 'net';

import { IResponse } from './IResponse';
import { IRequest } from './IRequest';
import { IEndpoint } from './IEndpoint';
import { Request } from './Request';
import { Response } from './Response';
import { Endpoint } from './Endpoint';
import { Socket } from './Socket';

import { kebabToCammel } from '../utils/utils';
import { matchParams, destructQueryString, getHttpStatuses } from '../utils/request';

export class Http {
  private socket: Socket;
  private endpoints:Array<IEndpoint>;

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

    const response = new Response();
    const endpoint = this.findEndpoint(request.method, request.resource);

    if (endpoint) {
      request.replacePathParameters(endpoint)
      await endpoint.processRequest(request, response);
    }

    /* console.log(`=================
    Request to ${request.resource}
    METHOD ${request.method}
    PAYLOAD ${request.body}
    =================
    STATUS ${response.statusCode}
    PAYLOAD ${response.body}
    `) */

    socket.write(this.mountResponse(request, response));
    socket.end();
  }

  private findEndpoint(method: string, route: string): IEndpoint | void {
    const endpoint = this.endpoints.find(endpoint => {
      if (endpoint.method !== method) return false;
      return matchParams(route, endpoint.route);
    });

    if (endpoint) return endpoint;

    return this.endpoints.find(endpoint => endpoint.method === method && endpoint.route === '*');
  }

  private createRequest(strRequest: string): IRequest {
    const args = strRequest.split('\r\n')

    const [method, resourceStr, protocol] = args.splice(0,1)[0].split(' ');
    const { resource, params } = destructQueryString(resourceStr);

    const headers: { [key: string]: string } = {};

    let header = '';
    do {
      header = args.splice(0,1)[0];

      if (header !== '') {
        const [key, value] = header.split(': ')

        headers[kebabToCammel(key)] = value;
      }

    } while(header !== '');

    // ? After last header there is a empty line
    args.splice(0,1)

    // ? The rest of arguments are the body
    const body = args.join('\r\n')

    return new Request(method, resource, headers, params, body, protocol);
  }

  private mountResponse(req: IRequest, res: IResponse): string {
    const responseStatus = this.getHttpStatus(res.statusCode);

    const arr = [];

    arr.push(`${req.protocol} ${res.statusCode} ${responseStatus}`);

    res.addHeader('Status', String(res.statusCode))
    res.addHeader('Content-Type', `${res.mimeType}; charset=utf-8`);
    res.addHeader('Date', new Date().toUTCString());

    res.addHeader('Content-Length', res.body.length.toString());

    for (const [key, value] of Object.entries(res.headers)) {
      arr.push(`${key}: ${value}`);
    }

    arr.push('');

    arr.push(res.body, '');

    return arr.join('\r\n');
  }

  private getHttpStatus(statusCode: number = 0): string
  {
    const statuses = getHttpStatuses();
    return statuses[statusCode] || '';
  }
}