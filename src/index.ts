import { IResponse } from './protocol/IResponse';
import { Http } from './protocol/Http';
import { IRequest } from './protocol/IRequest';

const app = new Http();

app.registerEndpoint('GET', '/', (req: IRequest, res: IResponse) => {
  return `
  <html>
    <body>
      <h1>Página entregue pelo servidor ;)</h1>
      <p>Um breve texto descrevendo uma simple página html</p>
    </body>
  </html>
  `
})

app.start(4000, () => {
  console.log('server running with port 4000')
});