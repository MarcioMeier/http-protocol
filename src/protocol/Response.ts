import { IResponse } from './IResponse';

export class Response implements IResponse{
  public headers: { [key: string]: string };
  public body: string;
  public statusCode: number | undefined;
  public mimeType: string | undefined;

  constructor() {
    this.headers = {};
    this.body = '';
  }

  public addHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  public response(statusCode: number, response: string | Object | any[]): void {
    this.statusCode = statusCode;

    this.body = this.toBody(response)
    this.mimeType = this.getMime();
  }

  private toBody(response: string | Object | any[]): string {
    if (typeof response === 'string') return response;

    return JSON.parse(<any>response);
  }

  private getMime() {
    if (/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/.test(this.body)) return 'text/html';
    
    try {
      if (JSON.parse(this.body)) return 'application/json';
    } catch{}

    return 'text/plain';
  }

}