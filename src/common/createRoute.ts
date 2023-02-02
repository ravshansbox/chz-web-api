import type { Handler, Method, Route } from './types';

export const createRoute = (method: Method, path: string, handler: Handler): Route => {
  return { method, path, handler };
};
