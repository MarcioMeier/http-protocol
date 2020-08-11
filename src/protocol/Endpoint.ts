import { IResponse } from './IResponse';
import { IRequest } from './IRequest';
export class Endpoint {

  constructor(
    public method: string,
    public route: string,
    public handler: any
  ) {}

  public async processRequest(req: IRequest, res: IResponse) {
    if (req.method !== this.method)
      res.response(500, 'Invalid method')
      
    if (req.resource !== this.route)
      res.response(500, 'Invalid route')

    return await this.handle(req, res);
  }

  private async handle(req: IRequest, res: IResponse) {
    try {
      const response = this.handler(req, res);

      if (response instanceof Promise) {
        const result = await response;
        res.response(200, result);
      } else {
        res.response(200, response);
      }
    } catch(err) {
      res.response(500, err.error || err.message || err);
    }
  }
}