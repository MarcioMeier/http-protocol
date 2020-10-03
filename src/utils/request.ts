
export function destructQueryString(str: string): { resource: string, params: {}} {
  const [resource, query] = str.split('?');

  if (!query) return { resource, params: {}}

  const args = query.split('&')
  const params: {[key: string]: any} = {};

  for (const param of args) {
    const [key, value] = param.split('=');
    params[key] = value;
  }

  return { resource, params };
}

export function matchParams(route: string, matchingRoute: string) {
  const piecesRoute = route.split('/');
  const piecesMatching = matchingRoute.split('/');

  // ? Fisrt item is empty because route starts with '/'
  piecesRoute.shift();
  piecesMatching.shift();

  if (piecesRoute.length !== piecesMatching.length) return false;

  let finalPath = piecesMatching.reduce((acc, current, index) => {
    const firstCharacter = current.substr(0, 1);
    const lastCharacter = current.substr(current.length -1);

    let partialPath = '';

    if (firstCharacter === '{' && lastCharacter === '}') {
      partialPath = piecesRoute[index];
    } else {
      partialPath = current;
    }

    acc += `/${partialPath}`
    return acc;
  }, '');

  return finalPath === route;
}

export function getPathParameters(route: string, matchingRoute: string): { [key: string]: any } {
  const values = route.split('/');
  const pieces = matchingRoute.split('/');

  const parameters: { [key: string]: any } = {};

  pieces.forEach((piece: string, index: number) => {
    const firstCharacter = piece.substr(0, 1);
    const lastCharacter = piece.substr(piece.length -1);

    if (firstCharacter !== '{' && lastCharacter !== '}') return;

    const parameter:string = piece.substr(1, piece.length - 2)
    const value:any = values[index];

    parameters[parameter] = value;
  })

  return parameters;
}


export function getHttpStatuses(): { [key: number]: string }
{
  return {
    100: 'Continue',
    101: 'Switching Protocols',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Time-out',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Large',
    415: 'Unsupported Media Type',
    416: 'Requested range not satisfiable',
    417: 'Expectation Failed',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Time-out',
    505: 'HTTP Version not supported',
  }
}