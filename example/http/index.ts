import { Http, IResponse, IRequest } from '../../src/index';

const app = new Http();

app.registerEndpoint('PUT', '/user/{userId}', async (req: IRequest, res: IResponse) => {
  const { userId } = req.pathParameters;
  const { showPassword } = req.params;

  // ? put user logic
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