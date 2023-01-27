import { type IncomingMessage, type ServerResponse } from 'node:http';
import { match as createMatch, type MatchFunction } from 'path-to-regexp';
import { sendJson } from './json';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type Route = {
  method: Method | null;
  path: string | null;
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

type AddRoute = (method: Method | null, path: string | null, ...handlers: Handler[]) => void;

type AddRouter = (path: string, app: App) => void;

type RequestListener = (request: IncomingMessage, response: ServerResponse) => Promise<void>;

type App = {
  routes: Route[];
  addRoute: AddRoute;
  addRouter: AddRouter;
  requestListener: RequestListener;
};

export const createRouter = () => {
  const routes: Route[] = [];

  const addRoute: AddRoute = (method, path, ...handlers) => {
    const match = path === null ? null : createMatch<Record<string, string>>(path);
    routes.push({ method, path, match, handlers });
  };

  const addRouter: AddRouter = (basePath, app) => {
    for (const { method, path, handlers } of app.routes) {
      const fullPath = `${basePath}${path}`;
      const match = path === null ? null : createMatch<Record<string, string>>(fullPath);
      routes.push({ method, path: fullPath, match, handlers });
    }
  };

  const requestListener: RequestListener = async (request, response) => {
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
    routes,
    addRoute,
    addRouter,
    requestListener,
  };
};
