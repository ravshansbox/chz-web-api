export class HttpError extends Error {
  constructor(public readonly details: any, public readonly statusCode: number) {
    super(typeof details === 'string' ? details : undefined);
  }
}
