export interface IRequest {
  method: string;
  resource: string;
  headers: Object;
  params: Object;
  body: string;
  pathParameters: Object;
}