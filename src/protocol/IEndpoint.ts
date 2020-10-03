import { IRequest } from './IRequest';
import { IResponse } from './IResponse';

export interface IEndpoint {
  method: string;
  route: string;
  handler: any;
  processRequest(req: IRequest, res: IResponse): Promise<void>;
}