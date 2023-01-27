import { type IncomingMessage, type ServerResponse } from 'node:http';
import { match as createMatch, type MatchFunction } from 'path-to-regexp';
import { sendJson } from './json';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Route = {
  method: Method | null;
  match: MatchFunction<Record<string, string>> | null;
  handlers: Handler[];
};

type Context = {
  request: IncomingMessage;
  response: ServerResponse;
  params: Record<string, string>;
  query: URLSearchParams;
};

type Handler = (context: Context) => Promise<void> | void;

export const createApp = () => {
  const routes: Route[] = [];

  const addRoute = (method: Method, path: string, ...handlers: Handler[]) => {
    routes.push({ method, match: createMatch(path), handlers });
  };

  const requestListener = async (request: IncomingMessage, response: ServerResponse) => {
    const url = new URL(request.url ?? '', `http://${request.headers.host}`);
    let matched = false;
    for (const { method, match, handlers } of routes) {
      const isMethodOK = method === null || method === request.method;
      if (!isMethodOK) {
        continue;
      }
      let isPathOK = false;
      let params: Record<string, string> = {};
      if (match === null) {
        isPathOK = true;
      } else {
        const matchResult = match(url.pathname);
        if (matchResult !== false) {
          isPathOK = true;
          params = matchResult.params;
        }
      }
      if (!isPathOK) {
        continue;
      }
      matched = true;
      try {
        for (const handler of handlers) {
          const result = handler({ request, response, params, query: url.searchParams });
          if (result instanceof Promise) {
            await result;
          }
        }
      } catch (error) {
        response.statusCode = 500;
        sendJson(response, { message: 'Something went wrong' });
        console.error(error);
      }
    }
    if (!matched) {
      response.statusCode = 404;
      sendJson(response, { message: `No route for ${request.method} ${url.pathname}` });
    }
  };

  return {
    get: addRoute.bind(null, 'GET'),
    post: addRoute.bind(null, 'POST'),
    put: addRoute.bind(null, 'PUT'),
    delete: addRoute.bind(null, 'DELETE'),
    requestListener,
  };
};

export type App = ReturnType<typeof createApp>;
