export function kebabToCammel(name: string) {
  const firtLetter = name.substr(0,1)
  const cammel = name.substr(1).replace(/-([a-zA-Z])/g, (g) => g[1].toUpperCase());

  return `${firtLetter.toLowerCase()}${cammel}`;
}

export function toBody(value: string | Object | any[]): string {
  if (typeof value === 'string') return value;

  return JSON.stringify(<any>value);
}

export function getMime(value: string) {
  if (/<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/.test(value)) return 'text/html';

  try {
    if (JSON.parse(value)) return 'application/json';
  } catch{}

  return 'text/plain';
}
