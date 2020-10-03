import { IEndpoint } from "./IEndpoint";

export interface IRequest {
  method: string;
  resource: string;
  body: string;
  protocol: string;
  headers: { [key: string]: any };
  params: { [key: string]: any };
  pathParameters: { [key: string]: any };
  replacePathParameters(endpoint: IEndpoint): void;
}