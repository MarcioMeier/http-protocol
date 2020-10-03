import { IResponse } from './IResponse';
import { toBody, getMime } from '../utils/utils';

export class Response implements IResponse{
  public headers: { [key: string]: string };
  public body: string;
  public statusCode: number | undefined;
  public mimeType: string | undefined;

  constructor() {
    this.headers = {};
    this.body = '';
    this.statusCode = 404;
  }

  public addHeader(key: string, value: string): void {
    this.headers[key] = value;
  }

  public response(statusCode: number, response: string | Object | any[], contentType?: string | undefined): void {
    this.statusCode = statusCode;

    this.body = toBody(response)
    this.mimeType = contentType || getMime(this.body);
  }
}