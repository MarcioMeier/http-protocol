export interface IResponse {
  headers: Object;
  body: string;
  addHeader(key: string, value: string): void;
  response(statusCode: number, response: string | Object | Array<any>): void;
}