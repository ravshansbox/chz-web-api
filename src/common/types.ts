import type { IncomingMessage, ServerResponse } from 'http';
import type { MatchFunction } from 'path-to-regexp';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type Route = {
  method: Method | null;
  path: string | null;
  handler: Handler;
};

export type RouteInternal = Route & {
  match: MatchFunction<Record<string, string>> | null;
};

export type Context = {
  request: IncomingMessage;
  response: ServerResponse;
  pathParams: Record<string, string>;
  searchParams: URLSearchParams;
};

export type Handler = (context: Context) => Promise<void> | void;

export type AddRoute = (route: Route) => void;

export type AddRoutes = (path: string, { routes }: { routes: Route[] }) => void;

export type RequestListener = (request: IncomingMessage, response: ServerResponse) => Promise<void>;

export type AppRoutes = {
  routes: RouteInternal[];
};

export type App = AppRoutes & {
  addRoute: AddRoute;
  addRouter: AddRoutes;
  requestListener: RequestListener;
};
