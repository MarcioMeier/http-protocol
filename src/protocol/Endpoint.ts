import { IResponse } from './IResponse';
import { IRequest } from './IRequest';
import { IEndpoint } from './IEndpoint';
import { matchParams } from '../utils/request';
export class Endpoint implements IEndpoint {

  constructor(
    public method: string,
    public route: string,
    public handler: any
  ) {}

  public async processRequest(req: IRequest, res: IResponse) {
    if (req.method !== this.method)
      return res.response(500, 'Invalid method')

    if (!matchParams(req.resource, this.route) && this.route !== '*')
      return res.response(500, 'Invalid route')

    return this.handle(req, res);
  }

  private async handle(req: IRequest, res: IResponse) {
    try {
      const result = this.handler(req, res);

      if (result instanceof Promise) {
        await result;
      }
    } catch(err) {
      res.response(500, err.error || err.message || err);
    }
  }
}