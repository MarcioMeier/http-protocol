import * as net from 'net';

import { IResponse } from './IResponse';
import { IRequest } from './IRequest';
import { Request } from './Request';
import { Response } from './Response';
import { Socket } from './Socket';
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

    const response = new Response();
    const endpoint = this.findEndpoint(request.method, request.resource);

    if (endpoint) {
      await endpoint.processRequest(request, response);
    }
    
    socket.write(this.mountResponse(request, response));
  }

  private findEndpoint(method: string, route: string): Endpoint | void {
    const index = this.endpoints.findIndex(endpoint => endpoint.method === method && endpoint.route === route);
    if (index >= 0) return this.endpoints[index];
  }

  private createRequest(strRequest: string): IRequest {
    const args = strRequest.split('\r\n')

    const [method, resourceStr, protocol] = args.splice(0,1)[0].split(' ');
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

    return new Request(method, resource, headers, params, body, protocol);
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
    const responseStatus = this.getHttpStatus(res.statusCode);

    const arr = [];

    arr.push(`${req.protocol} ${res.statusCode} ${responseStatus}`);

    res.addHeader('Status', String(res.statusCode))
    res.addHeader('Content-Type', `${res.mimeType}; charset=utf-8`);
    res.addHeader('Date', new Date().toUTCString());

    res.addHeader('Content-Length', res.body.length.toString());

    // res.addHeader('Content-Encoding', 'gzip');  // ? Enviar header?

    for (const [key, value] of Object.entries(res.headers)) {
      arr.push(`${key}: ${value}`);
    }

    arr.push('');

    arr.push(res.body, '');

    return arr.join('\r\n');
  }

  private getHttpStatus(statusCode: number = 0): string
  {
    const statuses : { [key: number]: string} = {
      100: 'Continue',
      101: 'Switching Protocols',
      200: 'OK',
      201: 'Created',
      202: 'Accepted',
      203: 'Non-Authoritative Information',
      204: 'No Content',
      205: 'Reset Content',
      206: 'Partial Content',
      300: 'Multiple Choices',
      301: 'Moved Permanently',
      302: 'Found',
      303: 'See Other',
      304: 'Not Modified',
      305: 'Use Proxy',
      307: 'Temporary Redirect',
      400: 'Bad Request',
      401: 'Unauthorized',
      402: 'Payment Required',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      406: 'Not Acceptable',
      407: 'Proxy Authentication Required',
      408: 'Request Time-out',
      409: 'Conflict',
      410: 'Gone',
      411: 'Length Required',
      412: 'Precondition Failed',
      413: 'Request Entity Too Large',
      414: 'Request-URI Too Large',
      415: 'Unsupported Media Type',
      416: 'Requested range not satisfiable',
      417: 'Expectation Failed',
      500: 'Internal Server Error',
      501: 'Not Implemented',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Time-out',
      505: 'HTTP Version not supported',
    }

    return statuses[statusCode] || '';
  }
}