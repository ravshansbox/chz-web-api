import type { RequestListener } from 'node:http';
import { match as createMatch } from 'path-to-regexp';
import { HttpError } from './HttpError';
import { sendJson } from './json';
import type { AddRoute, AddRoutes, RouteInternal } from './types';

export const createRouter = () => {
  const routesInternal: RouteInternal[] = [];

  const addRoute: AddRoute = ({ method, path, handler }) => {
    const match = path === null ? null : createMatch<Record<string, string>>(path);
    routesInternal.push({ method, path, match, handler });
  };

  const addRoutes: AddRoutes = (basePath, { routes }) => {
    for (const { method, path, handler } of routes) {
      const fullPath = `${basePath}${path}`;
      const match = path === null ? null : createMatch<Record<string, string>>(fullPath);
      routesInternal.push({ method, path: fullPath, match, handler });
    }
  };

  const requestListener: RequestListener = async (request, response) => {
    const { pathname, searchParams } = new URL(request.url ?? '', `http://${request.headers.host}`);
    let matched = false;
    for (const { method, match, handler } of routesInternal) {
      const isMethodOK = method === null || method === request.method;
      if (!isMethodOK) {
        continue;
      }
      let isPathOK = false;
      let pathParams: Record<string, string> = {};
      if (match === null) {
        isPathOK = true;
      } else {
        const matchResult = match(pathname);
        if (matchResult !== false) {
          isPathOK = true;
          pathParams = matchResult.params;
        }
      }
      if (!isPathOK) {
        continue;
      }
      matched = true;
      try {
        const result = handler({ request, response, pathParams, searchParams });
        if (result instanceof Promise) {
          await result;
        }
      } catch (error) {
        let statusCode = 500;
        let message: string | object = 'Something went wrong';
        if (error instanceof Error) {
          message = error.message;
        }
        if (error instanceof HttpError) {
          statusCode = error.statusCode;
          message = error.details;
        }
        sendJson(response, { message }, statusCode);
        console.error(error);
      }
    }
    if (!matched) {
      sendJson(response, { message: `No route for ${request.method} ${pathname}` }, 404);
    }
  };

  return {
    routes: routesInternal,
    addRoute,
    addRoutes,
    requestListener,
  };
};
