export interface IResponse {
  body: string;
  headers: Object;
  statusCode: number | undefined;
  mimeType: string | undefined;
  addHeader(key: string, value: string): void;
  response(statusCode: number, response: string | Object | Array<any> | any, contentType?: string | undefined): void;
}