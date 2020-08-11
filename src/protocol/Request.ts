import { IRequest } from "./IRequest";

export class Request implements IRequest {

  public pathParameters: Object

  constructor(
    public method: string,
    public resource: string,
    public headers: Object,
    public params: Object,
    public body: string
    ) {
      this.pathParameters = {};
  }

}