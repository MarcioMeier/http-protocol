import * as fs from 'fs';
import * as util from 'util';
import * as mime from 'mime-types';

import { IResponse, Http, IRequest } from '../../src/index';

const app = new Http();

app.registerEndpoint('GET', '*', async (req: IRequest, res: IResponse) => {
  const folder = `${__dirname}/site`;

  const resource = req.resource === '/' ?'/index.html' : req.resource;

  const file = `${folder}${resource}`;

  const readFile = util.promisify(fs.readFile);

  try {
    const text = await readFile(file, 'utf8');
    const mimeType = mime.lookup(resource) || undefined;

    return res.response(200, text, mimeType);
  } catch(err) {
    console.log('err - > ', err);
    return res.response(404, 'file not found');
  }
})

app.start(3000, () => {
  console.log('server running with port 3000')
});