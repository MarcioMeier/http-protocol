export interface IRequest {
  method: string;
  resource: string;
  headers: Object;
  params: Object;
  body: string;
  protocol: string;
  pathParameters: Object;
}