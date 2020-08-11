import { IResponse } from './protocol/IResponse';
import { Http } from './protocol/Http';
import { IRequest } from './protocol/IRequest';

const app = new Http();

app.registerEndpoint('GET', '/', (req: IRequest, res: IResponse) => {
  console.log('req -> ', req);
})

app.start(4000, () => {
  console.log('server running with port 4000')
});