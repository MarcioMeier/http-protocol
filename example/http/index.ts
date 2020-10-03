import { Http, IResponse, IRequest } from '../../src/index';

const app = new Http();

app.registerEndpoint('POST', '/user/{userId}', async (req: IRequest, res: IResponse) => {
  /* get user logic */

  const { userId } = req.pathParameters;
  const { showPassword } = req.params;

  const user = {
    id: userId,
    name: 'user name',
    ...(showPassword ? { password: 123 } : {}),
  }

  res.response(200, user);
})

app.start(3000, () => {
  console.log('server running with port 3000')
});