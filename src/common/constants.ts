export const HEADERS = {
  CONTENT_TYPE: 'content-type',
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
} as const;

export const { HTTP_PORT = '80' } = process.env;
