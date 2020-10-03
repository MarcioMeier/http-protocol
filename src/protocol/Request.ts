import { IRequest } from "./IRequest";
import { IEndpoint } from "./IEndpoint";
import { getPathParameters } from '../utils/request';

export class Request implements IRequest {

  public pathParameters: { [key: string]: any };

  constructor(
    public method: string,
    public resource: string,
    public headers: Object,
    public params: Object,
    public body: string,
    public protocol: string
    ) {
      this.pathParameters = {};
  }

  replacePathParameters(endpoint: IEndpoint) {
    this.pathParameters = getPathParameters(this.resource, endpoint.route);
  }
}