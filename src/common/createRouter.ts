import { type IncomingMessage, type ServerResponse } from 'node:http';
import { match as createMatch, type MatchFunction } from 'path-to-regexp';
import { sendJson } from './json';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class HttpError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

export type Route = {
  method: Method | null;
  path: string | null;
  handler: Handler;
};

type RouteInternal = Route & {
  match: MatchFunction<Record<string, string>> | null;
};

type Context = {
  request: IncomingMessage;
  response: ServerResponse;
  params: Record<string, string>;
  query: URLSearchParams;
};

type Handler = (context: Context) => Promise<void> | void;

type AddRoute = (route: Route) => void;

type AddRouter = (path: string, app: App) => void;

type RequestListener = (request: IncomingMessage, response: ServerResponse) => Promise<void>;

type App = {
  routes: RouteInternal[];
  addRoute: AddRoute;
  addRouter: AddRouter;
  requestListener: RequestListener;
};

export const createRouter = () => {
  const routes: RouteInternal[] = [];

  const addRoute: AddRoute = ({ method, path, handler }: Route) => {
    const match = path === null ? null : createMatch<Record<string, string>>(path);
    routes.push({ method, path, match, handler });
  };

  const addRouter: AddRouter = (basePath, app) => {
    for (const { method, path, handler } of app.routes) {
      const fullPath = `${basePath}${path}`;
      const match = path === null ? null : createMatch<Record<string, string>>(fullPath);
      routes.push({ method, path: fullPath, match, handler });
    }
  };

  const requestListener: RequestListener = async (request, response) => {
    const url = new URL(request.url ?? '', `http://${request.headers.host}`);
    let matched = false;
    for (const { method, match, handler } of routes) {
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
        const result = handler({ request, response, params, query: url.searchParams });
        if (result instanceof Promise) {
          await result;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        const statusCode = error instanceof HttpError ? error.statusCode : 500;
        sendJson(response, { message }, statusCode);
        console.error(error);
      }
    }
    if (!matched) {
      sendJson(response, { message: `No route for ${request.method} ${url.pathname}` }, 404);
    }
  };

  return {
    routes,
    addRoute,
    addRouter,
    requestListener,
  };
};
